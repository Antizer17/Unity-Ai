import os
import json
import shutil
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.transcribe import transcribe_and_normalize
from app.notes import generate_notes_from_transcript
from app.rag import index_lecture_transcript, query_ai_tutor, query_general_tutor
from app.schema import ChatRequest
from dotenv import load_dotenv

load_dotenv()

# --- App Initialization -------------------------------------------------------

app = FastAPI(title="AI Lecture Companion API - Cybernauts 2026")

# Create persistent uploads directory if not exists and mount it
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

os.makedirs("temp_uploads", exist_ok=True)
app.mount("/temp_uploads", StaticFiles(directory="temp_uploads"), name="temp_uploads")

# CRITICAL FOR HACKATHONS: Allow React Frontend to talk to FastAPI without CORS blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows any origin/localhost port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



DATA_DIR = "data"
LECTURES_FILE = os.path.join(DATA_DIR, "lectures.json")

def seed_initial_data():
    os.makedirs(DATA_DIR, exist_ok=True)
    
    # 1. Seed lectures.json if not present
    if not os.path.exists(LECTURES_FILE):
        mock_lectures = [
            {
                "id": "lec-001",
                "title": "But what is a neural network? | Chapter 1, Deep learning",
                "description": "A comprehensive overview of artificial neural networks, covering perceptrons, activation functions, backpropagation, and gradient descent. This lecture lays the foundation for understanding modern deep learning architectures.",
                "fileUrl": "https://www.youtube.com/watch?v=aircAruvnKk",
                "thumbnailUrl": null,
                "duration": 200.0,
                "status": "READY",
                "userId": "user-001",
                "createdAt": "2026-06-10T14:00:00Z",
                "updatedAt": "2026-06-10T15:05:00Z"
            },
            {
                "id": "lec-002",
                "title": "Quantum Computers Explained – Limits of Human Technology",
                "description": "Explore the basics of quantum computing including qubits, superposition, entanglement, and quantum gates. Includes practical examples of quantum algorithms like Grover's search.",
                "fileUrl": "https://www.youtube.com/watch?v=JhHMJCUmq28",
                "thumbnailUrl": null,
                "duration": 60.0,
                "status": "READY",
                "userId": "user-001",
                "createdAt": "2026-06-08T09:00:00Z",
                "updatedAt": "2026-06-08T10:30:00Z"
            },
            {
                "id": "lec-003",
                "title": "Data Structures: Tries",
                "description": "Deep dive into B-Trees, Tries, and their applications in databases and search engines. Covers insertion, deletion, and search complexity analysis.",
                "fileUrl": "https://www.youtube.com/watch?v=zIjfhVPRZCg",
                "thumbnailUrl": null,
                "duration": 60.0,
                "status": "READY",
                "userId": "user-001",
                "createdAt": "2026-06-14T11:00:00Z",
                "updatedAt": "2026-06-14T11:00:00Z"
            },
            {
                "id": "lec-004",
                "title": "Machine Learning with Python",
                "description": "Learn the basics of ML using scikit-learn. Covers regression, classification, and evaluating model performance.",
                "fileUrl": "https://www.youtube.com/watch?v=7eh4d6sabA0",
                "thumbnailUrl": None,
                "duration": 300.0,
                "status": "READY",
                "userId": "user-001",
                "createdAt": "2026-06-10T10:00:00Z",
                "updatedAt": "2026-06-10T10:00:00Z"
            }
        ]
        with open(LECTURES_FILE, "w") as f:
            json.dump(mock_lectures, f, indent=2)

    # 2. Seed lec-001 Transcript
    transcript_001_path = os.path.join(DATA_DIR, "lec-001_transcript.json")
    if not os.path.exists(transcript_001_path):
        neural_network_segments = [
            {"id": "seg-001", "text": "Welcome everyone to today's lecture on neural networks. We'll start with the very basics and work our way up to understanding how modern deep learning systems are built.", "startTime": 0.0, "endTime": 12.0},
            {"id": "seg-002", "text": "A neural network is essentially a mathematical function that maps inputs to outputs through a series of transformations. The fundamental unit is called a neuron, or perceptron, which was first introduced by Frank Rosenblatt in 1958.", "startTime": 12.0, "endTime": 28.0},
            {"id": "seg-003", "text": "Each neuron takes weighted inputs, sums them up, adds a bias term, and passes the result through an activation function. Think of it as a tiny decision-maker that fires when the combined signal exceeds a threshold.", "startTime": 28.0, "endTime": 45.0},
            {"id": "seg-004", "text": "Now, let's talk about activation functions. The simplest one is the step function — it outputs 1 if the input is above zero, and 0 otherwise. But in practice, we use smoother functions like sigmoid, tanh, and ReLU.", "startTime": 45.0, "endTime": 62.0},
            {"id": "seg-005", "text": "ReLU, or Rectified Linear Unit, has become the most popular choice. It simply outputs the input if positive, and zero otherwise. Its simplicity makes it computationally efficient and helps mitigate the vanishing gradient problem.", "startTime": 62.0, "endTime": 80.0},
            {"id": "seg-006", "text": "When we stack multiple layers of neurons, we get what's called a multi-layer perceptron or a feed-forward neural network. The layers between input and output are called hidden layers, and having more of them makes the network 'deeper'.", "startTime": 80.0, "endTime": 98.0},
            {"id": "seg-007", "text": "The magic of neural networks comes from the training process. We use an algorithm called backpropagation, which calculates how much each weight contributed to the error, and then adjusts them accordingly.", "startTime": 98.0, "endTime": 115.0},
            {"id": "seg-008", "text": "Backpropagation works by computing gradients — the partial derivatives of the loss function with respect to each weight. We then use gradient descent to update the weights in the direction that minimizes the loss.", "startTime": 115.0, "endTime": 132.0},
            {"id": "seg-009", "text": "The learning rate is a crucial hyperparameter. Too high, and the network overshoots the minimum. Too low, and training takes forever. Modern optimizers like Adam adaptively adjust the learning rate for each parameter.", "startTime": 132.0, "endTime": 150.0},
            {"id": "seg-010", "text": "Let's look at a practical example. Say we want to classify handwritten digits using the MNIST dataset. Each image is 28 by 28 pixels, giving us 784 input features.", "startTime": 150.0, "endTime": 165.0},
            {"id": "seg-011", "text": "We'd create a network with 784 input neurons, maybe two hidden layers with 128 and 64 neurons respectively, and 10 output neurons — one for each digit class. The output layer uses softmax to produce probabilities.", "startTime": 165.0, "endTime": 182.0},
            {"id": "seg-012", "text": "With just this simple architecture and proper training, we can achieve over 98% accuracy on digit recognition. This demonstrates the remarkable power of even basic neural networks when applied to real problems.", "startTime": 182.0, "endTime": 200.0}
        ]
        mock_transcript = {
            "id": "trans-001",
            "lectureId": "lec-001",
            "fullText": " ".join([s["text"] for s in neural_network_segments]),
            "language": "en",
            "segments": neural_network_segments
        }
        with open(transcript_001_path, "w") as f:
            json.dump(mock_transcript, f, indent=2)

    # 3. Seed lec-001 Notes
    notes_001_path = os.path.join(DATA_DIR, "lec-001_notes.json")
    if not os.path.exists(notes_001_path):
        mock_notes = {
            "id": "note-001",
            "lectureId": "lec-001",
            "content": "AI-generated structured notes for Introduction to Neural Networks",
            "sections": [
                {
                    "id": "note-sec-001",
                    "title": "Introduction to Neural Networks",
                    "content": "- Neural networks are mathematical functions that map inputs to outputs through transformations\n- Fundamental unit: **neuron** (perceptron), introduced by Frank Rosenblatt in 1958\n- Each neuron: weighted inputs → sum → bias → activation function",
                    "startTimestamp": 0.0,
                    "endTimestamp": 45.0,
                    "orderIndex": 0
                },
                {
                    "id": "note-sec-002",
                    "title": "Activation Functions",
                    "content": "- **Step function**: simplest, binary output (0 or 1)\n- **Sigmoid**: smooth S-curve, outputs between 0 and 1\n- **Tanh**: similar to sigmoid but outputs between -1 and 1\n- **ReLU** (Rectified Linear Unit): most popular modern choice\n  - Output = max(0, input)\n  - Computationally efficient\n  - Mitigates vanishing gradient problem",
                    "startTimestamp": 45.0,
                    "endTimestamp": 80.0,
                    "orderIndex": 1
                },
                {
                    "id": "note-sec-003",
                    "title": "Network Architecture",
                    "content": "- **Multi-layer perceptron (MLP)**: stacked layers of neurons\n- **Hidden layers**: layers between input and output\n- More hidden layers = \"deeper\" network\n- Feed-forward: data flows in one direction (input → output)",
                    "startTimestamp": 80.0,
                    "endTimestamp": 98.0,
                    "orderIndex": 2
                },
                {
                    "id": "note-sec-004",
                    "title": "Backpropagation & Training",
                    "content": "- **Backpropagation**: calculates each weight's contribution to error\n- Computes **gradients** (partial derivatives of loss w.r.t. weights)\n- **Gradient descent**: updates weights to minimize loss function\n- **Learning rate**: critical hyperparameter\n  - Too high → overshoots minimum\n  - Too low → slow convergence\n- **Adam optimizer**: adaptively adjusts learning rate per parameter",
                    "startTimestamp": 98.0,
                    "endTimestamp": 150.0,
                    "orderIndex": 3
                },
                {
                    "id": "note-sec-005",
                    "title": "Practical Example: MNIST Digit Classification",
                    "content": "- Dataset: 28×28 pixel handwritten digit images\n- Input: 784 features (flattened pixels)\n- Architecture: 784 → 128 → 64 → 10 neurons\n- Output layer: **softmax** for class probabilities\n- Achievable accuracy: **>98%** with basic architecture",
                    "startTimestamp": 150.0,
                    "endTimestamp": 200.0,
                    "orderIndex": 4
                },
                {
                    "id": "note-sec-006",
                    "title": "Key Takeaways",
                    "content": "- Neural networks are universal function approximators\n- Architecture design (layers, neurons) affects model capacity\n- Training requires careful tuning of hyperparameters\n- Even simple networks can solve complex real-world problems\n- Foundation for more advanced architectures (CNNs, RNNs, Transformers)",
                    "startTimestamp": 0.0,
                    "endTimestamp": 200.0,
                    "orderIndex": 5
                }
            ],
            "generatedAt": "2026-06-10T15:00:00Z"
        }
        with open(notes_001_path, "w") as f:
            json.dump(mock_notes, f, indent=2)

    # 4. Write simple placeholder files for lec-002 and lec-003 if they don't exist
    for idx, lec_id in enumerate(["lec-002", "lec-003"], start=2):
        tr_path = os.path.join(DATA_DIR, f"{lec_id}_transcript.json")
        nt_path = os.path.join(DATA_DIR, f"{lec_id}_notes.json")
        if not os.path.exists(tr_path):
            dummy_segments = [
                {"id": "seg-001", "text": f"This is the start of the lecture {lec_id}.", "startTime": 0.0, "endTime": 10.0},
                {"id": "seg-002", "text": "Here we discuss the core principles and fundamental definitions.", "startTime": 10.0, "endTime": 30.0},
                {"id": "seg-003", "text": "In conclusion, we summarized all major points and outlined the homework assignment.", "startTime": 30.0, "endTime": 60.0}
            ]
            dummy_transcript = {
                "id": f"trans-00{idx}",
                "lectureId": lec_id,
                "fullText": " ".join([s["text"] for s in dummy_segments]),
                "language": "en",
                "segments": dummy_segments
            }
            with open(tr_path, "w") as f:
                json.dump(dummy_transcript, f, indent=2)
                
        if not os.path.exists(nt_path):
            dummy_notes = {
                "id": f"note-00{idx}",
                "lectureId": lec_id,
                "content": f"AI-generated study notes for lecture {lec_id}.",
                "sections": [
                    {
                        "id": f"note-sec-00{idx}-1",
                        "title": "Lecture Overview",
                        "content": "- This lecture covers the fundamental concepts of this course.\n- Pay close attention to definitions and slide notes.",
                        "startTimestamp": 0.0,
                        "endTimestamp": 60.0,
                        "orderIndex": 0
                    }
                ],
                "generatedAt": "2026-06-12T10:00:00Z"
            }
            with open(nt_path, "w") as f:
                json.dump(dummy_notes, f, indent=2)

# Run seeding on application import/load
seed_initial_data()

def load_lectures_list() -> list:
    if os.path.exists(LECTURES_FILE):
        try:
            with open(LECTURES_FILE, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return []

def save_lectures_list(lectures: list):
    with open(LECTURES_FILE, "w") as f:
        json.dump(lectures, f, indent=2)

async def run_transcription_background(lecture_id: str, temp_file_path: str, url: str = None):
    """
    Background worker that runs transcription, note generation, and updates status.
    Saves to both JSON files (local) and MongoDB Atlas (cloud persistence).
    """
    try:
        if url:
            print(f"[AI] Downloading audio from {url} via yt-dlp...")
            import yt_dlp
            ydl_opts = {
                'format': 'bestaudio/best',
                'outtmpl': temp_file_path,
                'quiet': True,
                # Fix for yt-dlp ffmpeg requirement if not installed, we fallback to just downloading the native audio
                'postprocessors': [] 
            }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])

        # 1. Run transcription pipeline
        transcript = transcribe_and_normalize(temp_file_path, lecture_id)
        
        # 2. Save transcript to data folder (JSON)
        transcript_path = os.path.join(DATA_DIR, f"{lecture_id}_transcript.json")
        with open(transcript_path, "w") as f:
            json.dump(transcript, f, indent=2)
        
        # 2.5. Index transcript for RAG-based chat (from NaeemRagFeat)
        index_lecture_transcript(lecture_id)
        

        # 3. Run note generation pipeline
        notes = generate_notes_from_transcript(transcript)
        notes_path = os.path.join(DATA_DIR, f"{lecture_id}_notes.json")
        with open(notes_path, "w") as f:
            json.dump(notes, f, indent=2)
        

        # 4. Update status in lectures list (JSON)
        lectures = load_lectures_list()
        lecture_data = None
        for lec in lectures:
            if lec["id"] == lecture_id:
                lec["status"] = "READY"
                lec["duration"] = transcript.get("duration", 0.0)
                lec["updatedAt"] = datetime.utcnow().isoformat() + "Z"
                lecture_data = lec
                break
        save_lectures_list(lectures)
        

    except Exception as e:
        print(f"Background processing failed for {lecture_id}: {str(e)}")
        # Update status to FAILED in lectures list
        lectures = load_lectures_list()
        for lec in lectures:
            if lec["id"] == lecture_id:
                lec["status"] = "FAILED"
                lec["updatedAt"] = datetime.utcnow().isoformat() + "Z"
                break
        save_lectures_list(lectures)
        

    finally:
        # 5. Keep the temporary media file so the frontend can play it!
        pass

@app.get("/")
def health_check():
    return {"status": "healthy", "project": "AI Lecture Companion Backend"}

@app.get("/api/lectures")
def get_lectures():
    """
    Return all lectures.
    """
    lectures = load_lectures_list()
    return {"success": True, "data": lectures}

@app.get("/api/lectures/{lecture_id}")
def get_lecture_details(lecture_id: str):
    """
    Get metadata for a single lecture.
    """
    lectures = load_lectures_list()
    for lec in lectures:
        if lec["id"] == lecture_id:
            return {"success": True, "data": lec}
    raise HTTPException(status_code=404, detail="Lecture not found")

@app.post("/api/lectures")
async def create_lecture(
    background_tasks: BackgroundTasks,
    title: str = Form(...),
    description: str = Form(""),
    file: UploadFile = File(None),
    url: str = Form(None)
):
    """
    Upload a lecture, save it, and queue a background task for processing.
    """
    if not file and not url:
        raise HTTPException(status_code=400, detail="Must provide either a file or a web link")

    lecture_id = f"lec-{int(datetime.utcnow().timestamp())}"
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    
    try:
        if file:
            temp_file_path = os.path.join(temp_dir, f"{lecture_id}_{file.filename}")
            with open(temp_file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            file_url = f"/temp_uploads/{lecture_id}_{file.filename}"
        elif url:
            temp_file_path = os.path.join(temp_dir, f"{lecture_id}_audio.m4a")
            file_url = url

        # 2. Add metadata to our local store
        now_str = datetime.utcnow().isoformat() + "Z"
        new_lecture = {
            "id": lecture_id,
            "title": title,
            "description": description,
            "fileUrl": file_url,
            "thumbnailUrl": None,
            "duration": 0.0,  # Updated after transcription completes
            "status": "PROCESSING",
            "userId": "user-001",
            "createdAt": now_str,
            "updatedAt": now_str
        }

        lectures = load_lectures_list()
        lectures.insert(0, new_lecture)  # Add at the top of the list
        save_lectures_list(lectures)

        # 3. Schedule the background task for transcription and note generation
        background_tasks.add_task(run_transcription_background, lecture_id, temp_file_path, url)

        return {"success": True, "data": new_lecture}

    except Exception as e:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.get("/api/lectures/{lecture_id}/transcript")
def get_lecture_transcript(lecture_id: str):
    """
    Retrieve transcript for a given lecture.
    """
    transcript_path = os.path.join(DATA_DIR, f"{lecture_id}_transcript.json")
    if os.path.exists(transcript_path):
        try:
            with open(transcript_path, "r") as f:
                data = json.load(f)
                return {"success": True, "data": data}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading transcript: {str(e)}")
    raise HTTPException(status_code=404, detail="Transcript not found or still processing")

@app.get("/api/lectures/{lecture_id}/notes")
def get_lecture_notes(lecture_id: str):
    """
    Retrieve notes for a given lecture.
    """
    notes_path = os.path.join(DATA_DIR, f"{lecture_id}_notes.json")
    if os.path.exists(notes_path):
        try:
            with open(notes_path, "r") as f:
                data = json.load(f)
                return {"success": True, "data": data}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading notes: {str(e)}")
    raise HTTPException(status_code=404, detail="Notes not found or still processing")

# Person D Original Endpoint kept for compatibility
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
        
        os.makedirs(DATA_DIR, exist_ok=True)
        saved_json_path = f"data/{lecture_id}_transcript.json"
        with open(saved_json_path, "w") as f:
            json.dump(canonical_transcript, f, indent=2)
            
        return canonical_transcript

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
        
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


# --- RAG Chat Endpoints (from NaeemRagFeat - Person C) -------------------------

@app.post("/api/chat")
async def chat_with_tutor(request: ChatRequest):
    """
    RAG-powered chat endpoint. Accepts a lecture_id and question,
    retrieves relevant transcript segments, and generates an AI answer.
    Returns { answer, timestamps } with clickable timestamp references.
    """
    try:
        response = query_ai_tutor(
            lecture_id=request.lecture_id,
            student_query=request.question
        )
        if "error" in response:
            raise HTTPException(status_code=400, detail=response["error"])
        return {"success": True, "data": response}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


@app.post("/api/chat/general")
async def chat_general(request: ChatRequest):
    """
    General-purpose AI tutor chat (no specific lecture context).
    Used by the guest chat page for anonymous users.
    """
    try:
        response = query_general_tutor(student_query=request.question)
        return {"success": True, "data": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


# --- Notes Regeneration Endpoint (from feat/backend-integration - Person B) ---

@app.post("/api/lectures/{lecture_id}/notes/regenerate")
async def regenerate_notes(lecture_id: str):
    """
    Re-generates notes for a lecture by re-running the notes pipeline
    against the saved transcript.
    """
    transcript_path = os.path.join(DATA_DIR, f"{lecture_id}_transcript.json")
    if not os.path.exists(transcript_path):
        raise HTTPException(
            status_code=404,
            detail="Lecture transcript not found. Please transcribe the lecture first."
        )

    try:
        with open(transcript_path, "r") as f:
            transcript = json.load(f)

        print(f"[AI] Regenerating notes for {lecture_id}...")
        notes = generate_notes_from_transcript(transcript)

        notes_path = os.path.join(DATA_DIR, f"{lecture_id}_notes.json")
        with open(notes_path, "w") as f:
            json.dump(notes, f, indent=2)

        return {"success": True, "data": notes}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notes regeneration failed: {str(e)}")