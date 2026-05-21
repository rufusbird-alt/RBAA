# RBAA Image Search

Visual similarity search over the RBAA pCloud image archive using CLIP + FAISS.  
Search by dropping an image **or** typing a description — both work in the same embedding space.

---

## Requirements

- Python 3.10+
- ~4 GB disk for the CLIP model (downloaded automatically on first run)
- pCloud Desktop sync folder mounted locally

---

## Setup

```bash
# 1. Clone / open the folder in VS Code

# 2. Create a virtual environment
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set your pCloud path
#    Edit config.py — change IMAGE_ROOT to match your sync folder:
#    e.g.  IMAGE_ROOT = Path.home() / "pCloud Drive"
```

---

## First run — build the index

```bash
python ingest.py
```

This walks every image in `IMAGE_ROOT`, generates CLIP embeddings, and writes:
- `index/rbaa.faiss` — the vector index
- `index/metadata.json` — path + location metadata for each image

**Time:** ~20–30 minutes for 8,000 images on a modern Mac (CPU).  
Run once; use `--update` for incremental additions thereafter.

```bash
python ingest.py --update     # add only new images, skip already-indexed ones
```

---

## Search

### Web UI (recommended)

```bash
python app.py
# → open http://localhost:5000
```

- **Drop an image** into the left panel to find visually similar works
- **Type a description** in the right panel for concept search:
  - `French commode ormolu mounts circa 1770`
  - `English marquetry writing table`
  - `Bronze group after the antique`
- Filter by **location** (derived from folder name) using the dropdown
- Click any result card to view the full image and file path

### CLI

```bash
# Search by image
python search.py --image /path/to/query.jpg

# Search by text
python search.py --text "French commode ormolu mounts 1770"

# Filter to one location, return 30 results
python search.py --image /path/to/query.jpg --location "Longleat" --k 30

# Show index statistics
python search.py --stats

# List all locations in the index
python search.py --locations
```

---

## Project structure

```
rbaa-image-search/
├── config.py          ← edit IMAGE_ROOT here
├── ingest.py          ← build / update the index
├── search_engine.py   ← core search logic (used by CLI and web UI)
├── search.py          ← CLI interface
├── app.py             ← Flask web UI
├── requirements.txt
├── index/             ← auto-generated after ingest
│   ├── rbaa.faiss
│   └── metadata.json
└── README.md
```

---

## How it works

1. **CLIP (ViT-L/14)** encodes every image into a 768-dimensional vector that captures semantic visual content — style, material, form, period — not just pixel similarity.
2. **FAISS** (Facebook AI Similarity Search) stores those vectors and performs fast approximate nearest-neighbour search.
3. Because CLIP shares an embedding space for images and text, a text description and a photograph of the same object produce similar vectors — enabling cross-modal search.

---

## Metadata and the naming pipeline

Folder names become the `location` field automatically. As you find clusters of related objects through search, you can batch-rename them from the results:

```bash
# Example: find all results, copy their paths for batch rename
python search.py --image query.jpg --k 50 > results.txt
```

The `location` filter in the web UI lets you restrict search to a single house — useful when you know where an object was photographed.

---

## Extending

- **Add Obsidian note links:** modify `extract_meta()` in `ingest.py` to check whether a matching `.md` file exists in your vault and store its path in metadata.
- **Export results to CSV:** add `--csv output.csv` flag to `search.py`.
- **Artnet integration:** run a text search against Artnet results — descriptions from sale catalogues can be dropped directly into the text search box.
