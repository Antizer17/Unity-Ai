import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from app.transcribe import transcribe_and_normalize
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager

# Import your validation schemas and your notes pipeline function
from app.schema import CanonicalTranscript, StructuredNotes
from app.notes import generate_notes

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pass running loop explicitly to prevent Windows async hanging bugs during hackathons
    import asyncio
    loop = asyncio.get_running_loop()
    
    app.mongodb_client = AsyncIOMotorClient(MONGO_URI, io_loop=loop)
    app.db = app.mongodb_client["lecture_companion"]
    
    print("MONGO_URI Loaded: YES")
    print("Creating MongoDB client...")
    print("Pinging MongoDB...")
    
    try:
        await app.mongodb_client.admin.command('ping')
        print("MongoDB Ping Result: {'ok': 1}")
        print("SUCCESSFULLY CONNECTED TO MONGODB")
    except Exception as e:
        print(f"FAILED TO CONNECT TO MONGODB: {str(e)}")
        
    yield  # Application serves requests here
    
    app.mongodb_client.close()
    print("MongoDB connection closed safely.")

# Initialize application
app = FastAPI(title="AI Lecture Companion API - Cybernauts 2026", lifespan=lifespan)

# Setup fallbacks for any existing legacy top-level database usage
client = AsyncIOMotorClient(MONGO_URI)
db = client["lecture_companion"]

# CRITICAL FOR HACKATHONS: Allow React Frontend to talk to FastAPI without CORS blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows any local front-end origin/port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "healthy", "project": "AI Lecture Companion Backend"}

@app.post("/api/transcribe")
async def api_transcribe_lecture(
    request: Request,
    lecture_id: str = Form(...),  # Received as form-data string
    file: UploadFile = File(...)   # Received as form-data binary file
):
    """
    Endpoint for Person D (Frontend) to upload audio/video.
    Saves the file temporarily, runs Person A's transcription pipeline,
    saves the validated JSON structure to MongoDB, and returns it.
    """
    db_instance = request.app.db
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
        with open(saved_json_path, "w") as f:
            import json
            json.dump(canonical_transcript, f, indent=2)
        
        # 4. Validate & Save natively to MongoDB
        validated_transcript = CanonicalTranscript(**canonical_transcript)
        await db_instance.transcripts.update_one(
            {"lecture_id": lecture_id},
            {"$set": validated_transcript.model_dump()},
            upsert=True
        )
        print(f"💾 MongoDB: Successfully saved transcript data for lecture {lecture_id}")
        
        return canonical_transcript

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
        
    finally:
        # 5. Clean up: Delete the heavy audio/video file so you don't run out of disk space
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.post("/api/notes/{lecture_id}")
async def create_notes_endpoint(lecture_id: str, request: Request):
    """
    Pulls the saved transcript from MongoDB, pushes it through your single-pass
    or two-pass Groq engine, validates against the structured notes schema,
    and stores the results permanently into the notes collection.
    """
    db_instance = request.app.db
    
    # 1. Fetch raw transcript out of MongoDB using the lecture_id
    transcript_doc = await db_instance.transcripts.find_one({"lecture_id": lecture_id})
    if not transcript_doc:
        raise HTTPException(
            status_code=404, 
            detail="Lecture transcript not found. Please transcribe the lecture audio first."
        )
        
    # Remove MongoDB internal tracking key before running your LLM pipeline
    if "_id" in transcript_doc:
        del transcript_doc["_id"]
        
    try:
        print(f"🧠 AI Pipeline: Processing Llama 3.3 study notes for {lecture_id}...")
        
        # 2. Call your wrapper function from notes.py to catch chunking strat decisions
        generated_notes = generate_notes(transcript_doc)
        
        # 3. Enforce validation using your matched Pydantic schema model
        validated_notes = StructuredNotes(**generated_notes)
        
        # 4. Save the finalized object into your 'notes' collection
        await db_instance.notes.update_one(
            {"lecture_id": lecture_id},
            {"$set": validated_notes.model_dump()},
            upsert=True
        )
        print(f"💾 MongoDB: Successfully saved structured study notes for {lecture_id}")
        
        return validated_notes.model_dump()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notes compilation failed: {str(e)}")