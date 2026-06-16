import os
import json
import shutil
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv

from app.transcribe import transcribe_and_normalize
from app.notes import generate_notes_from_transcript
from app.rag import index_lecture_transcript, query_ai_tutor

load_dotenv()

app = FastAPI(title="AI Lecture Companion API - Cybernauts Live Demo")

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

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


DATA_DIR = "data"
LECTURES_FILE = os.path.join(DATA_DIR, "lectures.json")


def seed_initial_data():
    """
    Presentation Safety Net: Ensures the application has populated
    dashboard data ready to demo instantly without waiting for upload lags.
    """
    os.makedirs(DATA_DIR, exist_ok=True)

    # 1. Seed lectures list dashboard overview
    if not os.path.exists(LECTURES_FILE):
        mock_lectures = [
            {
                "id": "lec-001",
                "title": "Introduction to Neural Networks",
                "description": "A comprehensive overview of artificial neural networks, covering perceptrons, activation functions, backpropagation, and gradient descent.",
                "fileUrl": "",
                "thumbnailUrl": None,
                "duration": 200.0,
                "status": "READY",
                "userId": "user-001",
                "createdAt": "2026-06-10T14:00:00Z",
                "updatedAt": "2026-06-10T15:05:00Z",
            },
            {
                "id": "lec-002",
                "title": "Quantum Computing Fundamentals",
                "description": "Explore the basics of quantum computing including qubits, superposition, entanglement, and quantum gates.",
                "fileUrl": "",
                "thumbnailUrl": None,
                "duration": 60.0,
                "status": "READY",
                "userId": "user-001",
                "createdAt": "2026-06-08T09:00:00Z",
                "updatedAt": "2026-06-08T10:30:00Z",
            },
        ]
        with open(LECTURES_FILE, "w", encoding="utf-8") as f:
            json.dump(mock_lectures, f, indent=2)

    # 2. Seed lec-001 transcript
    transcript_001_path = os.path.join(DATA_DIR, "lec-001_transcript.json")
    if not os.path.exists(transcript_001_path):
        neural_network_segments = [
            {"id": 0, "text": "Welcome everyone to today's lecture on neural networks. We'll start with the very basics and work our way up to understanding how modern deep learning systems are built.", "start": 0.0, "end": 12.0},
            {"id": 1, "text": "A neural network is essentially a mathematical function that maps inputs to outputs through a series of transformations. The fundamental unit is called a neuron, or perceptron, which was first introduced by Frank Rosenblatt in 1958.", "start": 12.0, "end": 28.0},
            {"id": 2, "text": "Each neuron takes weighted inputs, sums them up, adds a bias term, and passes the result through an activation function.", "start": 28.0, "end": 45.0},
            {"id": 3, "text": "Now, let's talk about activation functions. The simplest one is the step function. But in practice, we use smoother functions like sigmoid, tanh, and ReLU.", "start": 45.0, "end": 62.0},
            {"id": 4, "text": "ReLU, or Rectified Linear Unit, has become the most popular choice. It simply outputs the input if positive, and zero otherwise.", "start": 62.0, "end": 80.0},
            {"id": 5, "text": "When we stack multiple layers of neurons, we get what's called a multi-layer perceptron or a feed-forward neural network.", "start": 80.0, "end": 98.0},
            {"id": 6, "text": "The magic of neural networks comes from the training process. We use an algorithm called backpropagation.", "start": 98.0, "end": 115.0},
            {"id": 7, "text": "Backpropagation works by computing gradients. We then use gradient descent to update the weights in the direction that minimizes the loss.", "start": 115.0, "end": 132.0},
        ]
        mock_transcript = {
            "lecture_id": "lec-001",
            "duration": 132.0,
            "language": "en",
            "segments": neural_network_segments,
        }
        with open(transcript_001_path, "w", encoding="utf-8") as f:
            json.dump(mock_transcript, f, indent=2)

    # 3. Seed lec-001 notes
    notes_001_path = os.path.join(DATA_DIR, "lec-001_notes.json")
    if not os.path.exists(notes_001_path):
        mock_notes = {
            "lecture_id": "lec-001",
            "topics": [
                {
                    "title": "Introduction to Neural Networks",
                    "start": 0.0,
                    "end": 45.0,
                    "summary": "Overview of neural networks as mathematical transformations, with the perceptron as the core building block, introduced by Rosenblatt in 1958.",
                    "key_points": [
                        "Neural networks map inputs to outputs through transformations",
                        "Perceptron introduced by Frank Rosenblatt in 1958",
                    ],
                    "technical_details": "",
                },
                {
                    "title": "Activation Functions",
                    "start": 45.0,
                    "end": 80.0,
                    "summary": "Activation functions introduce non-linearity; ReLU is the most widely used due to its simplicity and efficiency.",
                    "key_points": [
                        "Step function is the simplest activation function",
                        "Sigmoid, tanh, and ReLU are smoother alternatives",
                        "ReLU outputs max(0, x), helps mitigate vanishing gradients",
                    ],
                    "technical_details": "relu(x) = max(0, x)",
                },
            ],
        }
        with open(notes_001_path, "w", encoding="utf-8") as f:
            json.dump(mock_notes, f, indent=2)


seed_initial_data()


def load_lectures_list() -> list:
    if os.path.exists(LECTURES_FILE):
        try:
            with open(LECTURES_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return []


def save_lectures_list(lectures: list):
    with open(LECTURES_FILE, "w", encoding="utf-8") as f:
        json.dump(lectures, f, indent=2)


async def run_transcription_background(lecture_id: str, temp_file_path: str):
    """
    Background worker: transcribe -> save -> notes -> save -> update status.
    """
    try:
        transcript = transcribe_and_normalize(temp_file_path, lecture_id)

        transcript_path = os.path.join(DATA_DIR, f"{lecture_id}_transcript.json")
        with open(transcript_path, "w", encoding="utf-8") as f:
            json.dump(transcript, f, indent=2)

        await index_lecture_transcript(lecture_id)  # no-op, kept for compatibility

        notes = generate_notes_from_transcript(transcript)
        notes_path = os.path.join(DATA_DIR, f"{lecture_id}_notes.json")
        with open(notes_path, "w", encoding="utf-8") as f:
            json.dump(notes, f, indent=2)

        lectures = load_lectures_list()
        for lec in lectures:
            if lec["id"] == lecture_id:
                lec["status"] = "READY"
                lec["duration"] = transcript.get("duration", 0.0)
                lec["updatedAt"] = datetime.utcnow().isoformat() + "Z"
                break
        save_lectures_list(lectures)

    except Exception as e:
        print(f"Processing failed for {lecture_id}: {str(e)}")
        lectures = load_lectures_list()
        for lec in lectures:
            if lec["id"] == lecture_id:
                lec["status"] = "FAILED"
                lec["updatedAt"] = datetime.utcnow().isoformat() + "Z"
                break
        save_lectures_list(lectures)

    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.get("/")
def health_check():
    return {"status": "healthy", "engine": "Cybernauts Lecture Companion Backend"}


@app.get("/api/lectures")
def get_lectures():
    lectures = load_lectures_list()
    return {"success": True, "data": lectures}


@app.get("/api/lectures/{lecture_id}")
def get_lecture_details(lecture_id: str):
    lectures = load_lectures_list()
    for lec in lectures:
        if lec["id"] == lecture_id:
            return {"success": True, "data": lec}
    raise HTTPException(status_code=404, detail="Lecture data reference missing.")


@app.post("/api/lectures")
async def create_lecture(
    background_tasks: BackgroundTasks,
    title: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
):
    lecture_id = f"lec-{int(datetime.utcnow().timestamp())}"
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    temp_file_path = os.path.join(temp_dir, f"{lecture_id}_{file.filename}")

    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        now_str = datetime.utcnow().isoformat() + "Z"
        new_lecture = {
            "id": lecture_id,
            "title": title,
            "description": description,
            "fileUrl": f"/temp_uploads/{lecture_id}_{file.filename}",
            "thumbnailUrl": None,
            "duration": 0.0,
            "status": "PROCESSING",
            "userId": "user-001",
            "createdAt": now_str,
            "updatedAt": now_str,
        }

        lectures = load_lectures_list()
        lectures.insert(0, new_lecture)
        save_lectures_list(lectures)

        background_tasks.add_task(run_transcription_background, lecture_id, temp_file_path)
        return {"success": True, "data": new_lecture}

    except Exception as e:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Upload processing failed: {str(e)}")


@app.get("/api/lectures/{lecture_id}/transcript")
def get_lecture_transcript(lecture_id: str):
    transcript_path = os.path.join(DATA_DIR, f"{lecture_id}_transcript.json")
    if os.path.exists(transcript_path):
        try:
            with open(transcript_path, "r", encoding="utf-8") as f:
                return {"success": True, "data": json.load(f)}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    raise HTTPException(status_code=404, detail="Transcript not ready yet.")


@app.get("/api/lectures/{lecture_id}/notes")
def get_lecture_notes(lecture_id: str):
    notes_path = os.path.join(DATA_DIR, f"{lecture_id}_notes.json")
    if os.path.exists(notes_path):
        try:
            with open(notes_path, "r", encoding="utf-8") as f:
                return {"success": True, "data": json.load(f)}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    raise HTTPException(status_code=404, detail="Notes not ready yet.")


@app.post("/api/chat")
async def chat_with_tutor(request: ChatRequest):
    try:
        response = query_ai_tutor(
            lecture_id=request.lecture_id,
            student_query=request.question,
        )
        if "error" in response:
            raise HTTPException(status_code=400, detail=response["error"])
        return response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat request failed: {str(e)}")