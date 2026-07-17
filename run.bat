@echo off
echo Starting StadiumIQ AI FastAPI Backend...
start cmd /k "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000"

echo Starting StadiumIQ AI Next.js Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both services launched. Access the UI at http://localhost:3000
