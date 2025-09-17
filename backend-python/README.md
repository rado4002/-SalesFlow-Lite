# Backend (Python – FastAPI)

This folder contains the Python backend for SalesFlow Lite.  
It provides APIs for analytics, CSV/PDF export, and predictive features.

## Tech Stack
- Python 3.10+
- FastAPI
- Uvicorn

## Features
- CSV export
- PDF export (optional/advanced)
- Predictive analytics (optional/advanced)

## How to Run

1. Install Python 3.10 or above.
2. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Run the server:

   ```
   uvicorn main:app --reload
   ```

4. The backend will start on [http://localhost:8000](http://localhost:8000)

## API Documentation

Visit [http://localhost:8000/docs](http://localhost:8000/docs) for auto-generated API docs.
