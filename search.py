"""
RBAA Image Search — CLI
Usage:
    python search.py --image /path/to/query.jpg
    python search.py --text "French commode ormolu mounts 1770"
    python search.py --image /path/to/query.jpg --location "Longleat"
    python search.py --image /path/to/query.jpg --k 30
    python search.py --stats
    python search.py --locations
"""

import argparse
from pathlib import Path

from search_engine import (
    index_stats,
    list_locations,
    search_by_image,
    search_by_text,
)


def print_results(results: list[dict]):
    if not results:
        print("No results.")
        return
    print(f"\n{'RANK':<5} {'SCORE':<8} {'LOCATION':<25} {'SUBFOLDER':<30} FILENAME")
    print("─" * 100)
    for i, r in enumerate(results, 1):
        print(
            f"{i:<5} {r['pct']:<8} {r['location'][:24]:<25} "
            f"{r['subfolder'][:29]:<30} {r['filename']}"
        )
    print()


def main():
    parser = argparse.ArgumentParser(description="RBAA visual image search")
    group  = parser.add_mutually_exclusive_group()
    group.add_argument("--image",     type=Path, help="Query image path")
    group.add_argument("--text",      type=str,  help="Text description query")
    group.add_argument("--stats",     action="store_true", help="Show index statistics")
    group.add_argument("--locations", action="store_true", help="List all locations")
    parser.add_argument("--k",        type=int,  default=20,  help="Number of results")
    parser.add_argument("--location", type=str,  default=None, help="Filter by location name")
    args = parser.parse_args()

    if args.stats:
        s = index_stats()
        print(f"\nTotal images indexed : {s['total_images']:,}")
        print(f"Unique locations     : {s['locations']}")
        print("\nTop locations:")
        for loc, count in s["top_locations"]:
            print(f"  {count:>5}  {loc}")
        return

    if args.locations:
        for loc in list_locations():
            print(loc)
        return

    if args.image:
        if not args.image.exists():
            print(f"ERROR: file not found: {args.image}")
            return
        print(f"Searching by image: {args.image.name}")
        results = search_by_image(args.image, k=args.k, filter_location=args.location)

    elif args.text:
        print(f"Searching by text: '{args.text}'")
        results = search_by_text(args.text, k=args.k, filter_location=args.location)

    else:
        parser.print_help()
        return

    print_results(results)


if __name__ == "__main__":
    main()
