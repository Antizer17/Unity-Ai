import os
import json
from groq import Groq
from dotenv import load_dotenv

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(base_dir, ".env")
load_dotenv(dotenv_path=env_path)

def index_lecture_transcript(lecture_id: str):
    """
    Placeholder for structural alignment. 
    Since we save the JSON directly in main.py, we can read it on-the-fly.
    """
    print(f"Successfully tracked transcript for RAG matching: {lecture_id}")
    return True

def query_ai_tutor(lecture_id: str, student_query: str):

    # Build a cross-platform explicit path to the data directory at the server root
    transcript_path = os.path.join(base_dir, "data", f"{lecture_id}_transcript.json")
    
    # 1. Check if the lecture transcript exists
    if not os.path.exists(transcript_path):
        return {
            "answer": f"I couldn't find any lecture data for ID '{lecture_id}'. Please upload/transcribe the lecture video first.",
            "timestamps": []
        }
        
    try:
        with open(transcript_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        segments = data.get("segments", [])
        
        # 2. Extract context and grab timestamps relevant to the question
        context_text = ""
        matched_timestamps = []
        
        # Simple keywords search matching for hackathon speed
        keywords = [word.lower().strip("?,.!") for word in student_query.split() if len(word) > 3]
        
        for seg in segments:
            text_lower = seg["text"].lower()
            # If a segment contains a keyword, inject it into the AI's context window
            if any(kw in text_lower for kw in keywords) or len(context_text) < 2000:
                context_text += f"\n[{seg['start']:.1f}s - {seg['end']:.1f}s]: {seg['text']}"
                
                # If it's a strong keyword match, save the timestamp for Unity UI buttons
                if any(kw in text_lower for kw in keywords) and len(matched_timestamps) < 3:
                    # Formatted time conversion (e.g., 65.0s -> [01:05])
                    minutes = int(seg['start'] // 60)
                    seconds = int(seg['start'] % 60)
                    formatted_time = f"[{minutes:02d}:{seconds:02d}]"
                    
                    matched_timestamps.append({
                        "start": seg["start"],
                        "end": seg["end"],
                        "formatted": formatted_time
                    })

        # Fetch API Key securely from explicitly loaded environment
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return {"error": "GROQ_API_KEY environment variable not found inside your .env file."}

        # 3. Secure Groq LLM Query Execution
        client = Groq(api_key=api_key)
        
        system_prompt = (
            "You are an expert AI Lecture Tutor. Answer the student's question using ONLY the provided "
            "lecture transcript segments. Be concise, direct, and helpful. If the answer cannot be found "
            "in the transcript, use your general knowledge but note that it wasn't explicitly mentioned."
        )
        
        user_prompt = f"Lecture Content:\n{context_text}\n\nStudent Question: {student_query}"
        
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3
        )
        
        return {
            "answer": response.choices[0].message.content,
            "timestamps": matched_timestamps
        }
        
    except Exception as e:
        return {"error": f"RAG processing failed: {str(e)}"}