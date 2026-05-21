"""
RBAA Image Search — Search engine
Used by both the CLI (search.py) and the web UI (app.py).
"""

import json
from pathlib import Path
from typing import Optional

import faiss
import numpy as np
import open_clip
import torch
from PIL import Image

from config import (
    CLIP_MODEL,
    CLIP_PRETRAIN,
    INDEX_PATH,
    META_PATH,
    TOP_K,
)

# ── Singleton model (loaded once per process) ────────────────────────────────

_model     = None
_tokenizer = None
_preprocess = None
_device    = None
_index     = None
_meta      = None


def _load_model():
    global _model, _tokenizer, _preprocess, _device
    if _model is None:
        _device = "cuda" if torch.cuda.is_available() else "cpu"
        _model, _, _preprocess = open_clip.create_model_and_transforms(
            CLIP_MODEL, pretrained=CLIP_PRETRAIN
        )
        _tokenizer = open_clip.get_tokenizer(CLIP_MODEL)
        _model.eval().to(_device)


def _load_index():
    global _index, _meta
    if _index is None:
        if not INDEX_PATH.exists():
            raise FileNotFoundError(
                f"No index found at {INDEX_PATH}.\nRun:  python ingest.py"
            )
        _index = faiss.read_index(str(INDEX_PATH))
        with open(META_PATH) as f:
            _meta = json.load(f)


# ── Embedding helpers ────────────────────────────────────────────────────────

def _embed_image(path: Path) -> np.ndarray:
    _load_model()
    img    = _preprocess(Image.open(path).convert("RGB")).unsqueeze(0).to(_device)
    with torch.no_grad():
        feat = _model.encode_image(img)
        feat = feat / feat.norm(dim=-1, keepdim=True)
    return feat.cpu().numpy().astype(np.float32)


def _embed_text(text: str) -> np.ndarray:
    _load_model()
    tokens = _tokenizer([text]).to(_device)
    with torch.no_grad():
        feat = _model.encode_text(tokens)
        feat = feat / feat.norm(dim=-1, keepdim=True)
    return feat.cpu().numpy().astype(np.float32)


# ── Public API ───────────────────────────────────────────────────────────────

def search_by_image(
    query_path: Path,
    k: int = TOP_K,
    filter_location: Optional[str] = None,
) -> list[dict]:
    """Return top-k results for a query image."""
    _load_index()
    query_vec = _embed_image(query_path)
    return _run_search(query_vec, k, filter_location)


def search_by_text(
    query_text: str,
    k: int = TOP_K,
    filter_location: Optional[str] = None,
) -> list[dict]:
    """
    Return top-k results for a natural-language description.
    Example: 'French commode ormolu mounts circa 1770'
    """
    _load_index()
    query_vec = _embed_text(query_text)
    return _run_search(query_vec, k, filter_location)


def _run_search(
    query_vec: np.ndarray,
    k: int,
    filter_location: Optional[str],
) -> list[dict]:
    # Fetch more than k if filtering, to have enough after the filter
    fetch_k = k * 5 if filter_location else k
    fetch_k = min(fetch_k, _index.ntotal)

    scores, indices = _index.search(query_vec, fetch_k)
    results = []
    for score, idx in zip(scores[0], indices[0]):
        if idx < 0:
            continue
        m = _meta[idx]
        if filter_location and m["location"].lower() != filter_location.lower():
            continue
        results.append({
            **m,
            "score":   float(score),
            "pct":     f"{float(score)*100:.1f}%",
        })
        if len(results) >= k:
            break
    return results


def list_locations() -> list[str]:
    """Return all unique normalised location names in the index."""
    _load_index()
    return sorted({m["location"] for m in _meta})


def index_stats() -> dict:
    _load_index()
    from collections import Counter
    locs = Counter(m["location"] for m in _meta)
    return {
        "total_images": _index.ntotal,
        "locations":    len(locs),
        "top_locations": locs.most_common(10),
    }
