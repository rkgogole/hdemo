#!/bin/bash

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Install required packages
pip install -r requirements.txt

# Set environment variables for GCP
export PROJECT_ID="TO_DO_DEVELOPER"
export DATASET_ID="TO_DO_DEVELOPER"
export GCP_LOCATION="TO_DO_DEVELOPER"

# Run the data generation script
python datagen.py

# Deactivate virtual environment if it was activated
if [ -n "$VIRTUAL_ENV" ]; then
    deactivate
fi
