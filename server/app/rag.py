"""
rag.py

Retrieval-Augmented Generation (RAG) pipeline for the AI Lecture Tutor.
Integrated from NaeemRagFeat branch (Person C - Naeem).

Loads transcript JSON, performs keyword-based context retrieval from
transcript segments, sends relevant context to Groq's LLM, and returns
an answer with clickable timestamp references.
"""

import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Use the same data directory as main.py
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")


def index_lecture_transcript(lecture_id: str):
    """
    Placeholder for future vector-based indexing.
    Currently, we read transcript JSON on-the-fly for keyword matching.
    This function can be extended to build embeddings / ChromaDB index later.
    """
    transcript_path = os.path.join(DATA_DIR, f"{lecture_id}_transcript.json")
    if os.path.exists(transcript_path):
        print(f"[OK] RAG: Successfully tracked transcript for lecture: {lecture_id}")
        return True
    else:
        print(f"[WARN] RAG: Transcript file not found for lecture: {lecture_id}")
        return False


def query_ai_tutor(lecture_id: str, student_query: str) -> dict:
    """
    Main RAG query function.
    
    1. Loads the transcript JSON for the given lecture
    2. Performs keyword-based context retrieval from segments
    3. Sends relevant context + student question to Groq LLM
    4. Returns { answer, timestamps } with formatted time references
    
    Args:
        lecture_id: The lecture to query against
        student_query: The student's question
        
    Returns:
        dict with 'answer' (str) and 'timestamps' (list of dicts with start, end, formatted)
    """
    transcript_path = os.path.join(DATA_DIR, f"{lecture_id}_transcript.json")

    # 1. Check if the lecture transcript exists
    if not os.path.exists(transcript_path):
        return {
            "answer": f"I couldn't find any lecture data for ID '{lecture_id}'. Please upload and transcribe the lecture first.",
            "timestamps": []
        }

    try:
        with open(transcript_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        segments = data.get("segments", [])
        
        if not segments:
            return {
                "answer": "The transcript for this lecture appears to be empty. Please re-upload the lecture.",
                "timestamps": []
            }

        # 2. Extract context and grab timestamps relevant to the question
        context_text = ""
        matched_timestamps = []

        # Keyword-based matching for hackathon speed
        # Filter out short/common words to improve match quality
        keywords = [
            word.lower().strip("?,.!;:'\"()[]{}") 
            for word in student_query.split() 
            if len(word) > 3
        ]

        # Determine the correct field names (handle both conventions)
        start_field = "startTime" if "startTime" in segments[0] else "start"
        end_field = "endTime" if "endTime" in segments[0] else "end"

        for seg in segments:
            text_lower = seg["text"].lower()
            seg_start = seg.get(start_field, 0.0)
            seg_end = seg.get(end_field, 0.0)

            # Include segment if it contains a keyword OR we haven't gathered enough context
            if any(kw in text_lower for kw in keywords) or len(context_text) < 2000:
                context_text += f"\n[{seg_start:.1f}s - {seg_end:.1f}s]: {seg['text']}"

                # If it's a strong keyword match, save the timestamp for UI buttons
                if any(kw in text_lower for kw in keywords) and len(matched_timestamps) < 3:
                    minutes = int(seg_start // 60)
                    seconds = int(seg_start % 60)
                    formatted_time = f"[{minutes:02d}:{seconds:02d}]"

                    matched_timestamps.append({
                        "start": seg_start,
                        "end": seg_end,
                        "formatted": formatted_time
                    })

        # 3. Get Groq API key
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return {
                "answer": "I'm unable to process your question right now because the AI service is not configured. Please ensure the GROQ_API_KEY is set in the server's .env file.",
                "timestamps": matched_timestamps
            }

        # 4. Groq LLM Query
        client = Groq(api_key=api_key)

        system_prompt = (
            "You are an expert AI Lecture Tutor for the Unity-AI platform. Answer the student's "
            "question using ONLY the provided lecture transcript segments as your primary source. "
            "Be concise, direct, and helpful. Format your answer in Markdown for readability. "
            "If the answer cannot be found in the transcript, use your general knowledge but "
            "clearly note that it wasn't explicitly covered in the lecture. "
            "When referencing specific parts of the lecture, mention the approximate timestamps."
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
        print(f"[ERROR] RAG processing failed: {str(e)}")
        return {
            "answer": f"I encountered an error while processing your question. Please try again.",
            "timestamps": []
        }


def query_general_tutor(student_query: str) -> dict:
    """
    General-purpose AI tutor for guest chat mode (no specific lecture context).
    Uses Groq LLM to answer general study questions.
    
    Args:
        student_query: The student's question
        
    Returns:
        dict with 'answer' (str) and empty 'timestamps' list
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {
            "answer": "I'm unable to process your question right now because the AI service is not configured.",
            "timestamps": []
        }

    try:
        client = Groq(api_key=api_key)

        system_prompt = (
            "You are Unity-AI, a friendly and expert academic tutor. Help students with their "
            "study questions across all subjects. Be concise, use Markdown formatting, and "
            "provide clear explanations with examples where helpful. If asked about a specific "
            "lecture, suggest that the student upload the lecture for more precise answers."
        )

        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": student_query}
            ],
            temperature=0.4
        )

        return {
            "answer": response.choices[0].message.content,
            "timestamps": []
        }

    except Exception as e:
        print(f"[ERROR] General tutor query failed: {str(e)}")
        return {
            "answer": "I encountered an error processing your question. Please try again.",
            "timestamps": []
        }
