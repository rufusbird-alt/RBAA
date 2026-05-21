#!/bin/bash
source "/Users/rufusbird/Documents/Claude/Projects/Image Archive API/.venv/bin/activate"
export KMP_DUPLICATE_LIB_OK=TRUE
export OMP_NUM_THREADS=1
python "/Users/rufusbird/Documents/Claude/Projects/Image Archive API/app.py"
