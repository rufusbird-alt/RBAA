"""
RBAA Image Search — Ingest
Walks IMAGE_ROOT, embeds every image with CLIP, writes a FAISS index.

Usage:
    python ingest.py                  # full ingest
    python ingest.py --update         # only add images not yet in the index
    python ingest.py --root /path     # override IMAGE_ROOT for this run
"""

import argparse
import json
import sys
from pathlib import Path

import faiss
import numpy as np
import open_clip
import torch
from PIL import Image, UnidentifiedImageError
from tqdm import tqdm

from config import (
    BATCH_SIZE,
    CLIP_MODEL,
    CLIP_PRETRAIN,
    IMAGE_ROOT,
    INDEX_DIR,
    INDEX_PATH,
    META_PATH,
    SUPPORTED_EXTS,
)


# ── Model ────────────────────────────────────────────────────────────────────

def load_model():
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, _, preprocess = open_clip.create_model_and_transforms(
        CLIP_MODEL, pretrained=CLIP_PRETRAIN
    )
    model.eval().to(device)
    print(f"CLIP {CLIP_MODEL} loaded on {device}")
    return model, preprocess, device


# ── Image discovery ──────────────────────────────────────────────────────────

def discover_images(root: Path) -> list[Path]:
    paths = [
        p for p in root.rglob("*")
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTS
    ]
    print(f"Found {len(paths):,} images under {root}")
    return sorted(paths)


# ── Metadata extraction ──────────────────────────────────────────────────────

import re

# Patterns stripped from the END of a folder name, in order:
#   " June 2019"  " Dec 07"  " 2019"  " 07"  " 98"
_DATE_SUFFIX = re.compile(
    r"""
    (
        \s+
        (?:
            # Full month name or abbreviation, optionally followed by 2- or 4-digit year
            (?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|
               Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)
            (?:\s+\d{2,4})?
        |
            # Bare 4-digit year  e.g. " 2019"
            \d{4}
        |
            # Bare 2-digit year  e.g. " 07"  " 98"
            \d{2}
        )
    )+
    $
    """,
    re.VERBOSE | re.IGNORECASE,
)


def normalise_location(raw: str) -> str:
    """Strip trailing date/year suffixes and tidy whitespace."""
    cleaned = _DATE_SUFFIX.sub("", raw).strip()
    return cleaned if cleaned else raw  # guard against edge cases


def extract_meta(path: Path, root: Path) -> dict:
    """
    Derive lightweight metadata from the file path.
    Folder hierarchy:  root / location / [subfolder ...] / image.jpg

    location_raw  — exact folder name, e.g. "Alnwick June 2019"
    location      — normalised name,   e.g. "Alnwick"
    """
    relative     = path.relative_to(root)
    parts        = relative.parts          # ('Alnwick June 2019', 'Room X', 'img.jpg')
    location_raw = parts[0] if len(parts) > 1 else "unknown"
    location     = normalise_location(location_raw)
    subfolder    = "/".join(parts[1:-1]) if len(parts) > 2 else ""
    return {
        "path":         str(path),
        "location":     location,
        "location_raw": location_raw,
        "subfolder":    subfolder,
        "filename":     path.name,
    }


# ── Embedding ────────────────────────────────────────────────────────────────

def embed_batch(
    paths: list[Path],
    model,
    preprocess,
    device: str,
) -> np.ndarray:
    images = []
    valid  = []
    for p in paths:
        try:
            img = preprocess(Image.open(p).convert("RGB"))
            images.append(img)
            valid.append(p)
        except (UnidentifiedImageError, OSError):
            print(f"  ⚠ skipped (unreadable): {p.name}")
    if not images:
        return np.empty((0, 0), dtype=np.float32), []
    tensor = torch.stack(images).to(device)
    with torch.no_grad():
        features = model.encode_image(tensor)
        features = features / features.norm(dim=-1, keepdim=True)   # L2 normalise
    return features.cpu().numpy().astype(np.float32), valid


# ── Main ─────────────────────────────────────────────────────────────────────

def ingest(root: Path, update: bool = False):
    INDEX_DIR.mkdir(parents=True, exist_ok=True)

    # Load existing metadata if updating
    existing_paths: set[str] = set()
    existing_meta: list[dict] = []
    existing_embeddings: list[np.ndarray] = []

    if update and META_PATH.exists() and INDEX_PATH.exists():
        with open(META_PATH) as f:
            existing_meta = json.load(f)
        existing_paths = {m["path"] for m in existing_meta}
        old_index = faiss.read_index(str(INDEX_PATH))
        existing_embeddings = faiss.rev_swig_ptr(
            old_index.get_xb(), old_index.ntotal * old_index.d
        ).reshape(old_index.ntotal, old_index.d).copy()
        print(f"Update mode: {len(existing_paths):,} images already indexed")

    # Discover & filter
    all_paths = discover_images(root)
    if update:
        all_paths = [p for p in all_paths if str(p) not in existing_paths]
        print(f"New images to embed: {len(all_paths):,}")

    if not all_paths:
        print("Nothing to do.")
        return

    # Embed in batches
    model, preprocess, device = load_model()
    all_embeddings: list[np.ndarray] = []
    all_meta:       list[dict]        = []

    batches = [all_paths[i:i + BATCH_SIZE] for i in range(0, len(all_paths), BATCH_SIZE)]
    for batch in tqdm(batches, desc="Embedding", unit="batch"):
        embs, valid_paths = embed_batch(batch, model, preprocess, device)
        if len(valid_paths):
            all_embeddings.append(embs)
            all_meta.extend(extract_meta(p, root) for p in valid_paths)

    if not all_embeddings:
        print("No valid images embedded.")
        return

    new_embs = np.vstack(all_embeddings)

    # Merge with existing if updating
    if update and len(existing_embeddings):
        final_embs = np.vstack([existing_embeddings, new_embs])
        final_meta = existing_meta + all_meta
    else:
        final_embs = new_embs
        final_meta = all_meta

    # Build / write FAISS index (inner product over L2-normalised vectors = cosine similarity)
    dim   = final_embs.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(final_embs)
    faiss.write_index(index, str(INDEX_PATH))

    with open(META_PATH, "w") as f:
        json.dump(final_meta, f, indent=2)

    print(f"\n✓ Index written: {index.ntotal:,} images → {INDEX_PATH}")
    print(f"✓ Metadata written → {META_PATH}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="RBAA image ingest")
    parser.add_argument("--update", action="store_true", help="Add new images only")
    parser.add_argument("--root",   type=Path, default=None, help="Override IMAGE_ROOT")
    args = parser.parse_args()

    root = args.root or IMAGE_ROOT
    if not root.exists():
        sys.exit(f"ERROR: IMAGE_ROOT not found: {root}\nEdit config.py or pass --root")

    ingest(root, update=args.update)
