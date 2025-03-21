#!/bin/bash

# Create and activate virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
    echo "Virtual environment created."
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Now run the server with the virtual environment

pip install -r requirements.txt

# Start the FastAPI server
echo "Starting Smart Segmentation API server..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

