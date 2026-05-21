from pathlib import Path

IMAGE_ROOT = Path("/Users/rufusbird/pCloud Drive/MEDIA ARCHIVE/ART IMAGE ARCHIVE")

INDEX_DIR  = Path(__file__).parent / "index"
INDEX_PATH = INDEX_DIR / "rbaa.faiss"
META_PATH  = INDEX_DIR / "metadata.json"

CLIP_MODEL    = "ViT-B-32"
CLIP_PRETRAIN = "openai"

SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp"}
BATCH_SIZE     = 32
TOP_K          = 20
