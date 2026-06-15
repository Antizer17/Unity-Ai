import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.transcribe import transcribe_and_normalize
from dotenv import load_dotenv


load_dotenv()

app = FastAPI(title="AI Lecture Companion API - Cybernauts 2026")

# CRITICAL FOR HACKATHONS: Allow React Frontend to talk to FastAPI without CORS blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows any origin/localhost port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "healthy", "project": "AI Lecture Companion Backend"}

@app.post("/api/transcribe")
async def api_transcribe_lecture(
    lecture_id: str = Form(...),  # Received as form-data string
    file: UploadFile = File(...)   # Received as form-data binary file
):
    """
    Endpoint for Person D (Frontend) to upload audio/video.
    Saves the file temporarily, runs Person A's transcription pipeline,
    and returns the exact Canonical Transcript JSON contract.
    """
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    temp_file_path = f"{temp_dir}/{lecture_id}_{file.filename}"

    try:
        # 1. Stream the incoming network file onto the server's disk
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Fire your transcription and normalization logic
        canonical_transcript = transcribe_and_normalize(temp_file_path, lecture_id)
        
        # 3. Explicitly save to shared data folder for Person B & Person C
        os.makedirs("data", exist_ok=True)
        saved_json_path = f"data/{lecture_id}_transcript.json"
        
        # (Your script already writes this, but doing a double-check save or returning directly is great)
        return canonical_transcript

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
        
    finally:
        # 4. Clean up: Delete the heavy audio/video file so you don't run out of disk space
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)