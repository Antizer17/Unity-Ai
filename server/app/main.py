import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Local relative imports based on image_faa5a2.png layout
from .transcribe import transcribe_and_normalize
from .rag import index_lecture_transcript, query_ai_tutor
load_dotenv()

app = FastAPI(title="AI Lecture Companion API - Cybernauts 2026")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    lecture_id: str
    question: str

@app.get("/")
def health_check():
    return {"status": "healthy", "project": "AI Lecture Companion Backend"}

@app.post("/api/transcribe")
async def api_transcribe_lecture(
    lecture_id: str = Form(...),
    file: UploadFile = File(...)
):
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    temp_file_path = f"{temp_dir}/{lecture_id}_{file.filename}"

    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        canonical_transcript = transcribe_and_normalize(temp_file_path, lecture_id)
        
        # Save transcript to data directory for RAG usage
        os.makedirs("data", exist_ok=True)
        saved_json_path = f"data/{lecture_id}_transcript.json"
        with open(saved_json_path, "w", encoding="utf-8") as f:
            import json
            json.dump(canonical_transcript, f, indent=2)
        
        # Call RAG indexing
        index_lecture_transcript(lecture_id)
        
        return canonical_transcript

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@app.post("/api/chat")
async def chat_with_tutor(request: ChatRequest):
    try:
        response = query_ai_tutor(
            lecture_id=request.lecture_id, 
            student_query=request.question
        )
        if "error" in response:
            raise HTTPException(status_code=400, detail=response["error"])
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")