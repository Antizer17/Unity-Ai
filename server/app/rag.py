"""
rag.py

Simplified "naive RAG" for the AI Lecture Companion.
No vector DB, no MongoDB -- reads transcript + notes JSON directly from
local disk and does keyword-based retrieval, then asks Groq to answer
using that retrieved context.
"""

import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

DATA_DIR = "data"
MODEL = "llama-3.3-70b-versatile"


def _load_json(path):
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


async def index_lecture_transcript(lecture_id: str):
    """
    Async no-op, kept for compatibility with main.py's
    `await index_lecture_transcript(...)` call. No external indexing
    needed -- retrieval reads local files directly at query time.
    """
    return True


def _build_context(lecture_id: str, student_query: str):
    """
    Pulls together transcript segments + notes topics, does naive keyword
    matching against the query, and returns a context string plus matched
    timestamps for the frontend to jump to.
    """
    transcript_path = os.path.join(DATA_DIR, f"{lecture_id}_transcript.json")
    notes_path = os.path.join(DATA_DIR, f"{lecture_id}_notes.json")

    transcript = _load_json(transcript_path)
    notes = _load_json(notes_path)

    if not transcript and not notes:
        return None, []

    keywords = [w.lower().strip("?,.!") for w in student_query.split() if len(w) > 3]

    context_parts = []
    matched_timestamps = []

    # 1. Check notes topics first -- richer, already-summarized, includes technical_details
    if notes:
        for topic in notes.get("topics", []):
            searchable = " ".join([
                topic.get("title", ""),
                topic.get("summary", ""),
                " ".join(topic.get("key_points", [])),
                topic.get("technical_details", "") or "",
            ]).lower()

            if any(kw in searchable for kw in keywords):
                block = f"[Topic: {topic.get('title')}] ({topic['start']:.1f}s-{topic['end']:.1f}s)\n"
                block += f"Summary: {topic.get('summary', '')}\n"
                if topic.get("key_points"):
                    block += "Key points: " + "; ".join(topic["key_points"]) + "\n"
                if topic.get("technical_details"):
                    block += f"Technical details:\n{topic['technical_details']}\n"
                context_parts.append(block)

                if len(matched_timestamps) < 3:
                    matched_timestamps.append({
                        "start": topic["start"],
                        "end": topic["end"],
                        "label": topic.get("title", ""),
                    })

    # 2. Fall back to / supplement with raw transcript segments
    if transcript:
        for seg in transcript.get("segments", []):
            text_lower = seg["text"].lower()
            if any(kw in text_lower for kw in keywords):
                context_parts.append(f"[{seg['start']:.1f}s-{seg['end']:.1f}s] {seg['text']}")
                if len(matched_timestamps) < 5:
                    matched_timestamps.append({
                        "start": seg["start"],
                        "end": seg["end"],
                        "label": seg["text"][:60],
                    })

    # 3. If nothing matched any keyword, fall back to the first few notes topics
    #    so the chatbot still has *some* context instead of nothing
    if not context_parts and notes and notes.get("topics"):
        for topic in notes["topics"][:3]:
            context_parts.append(
                f"[Topic: {topic.get('title')}] Summary: {topic.get('summary', '')}"
            )

    context_text = "\n\n".join(context_parts) if context_parts else "(no matching content found)"
    return context_text, matched_timestamps


def query_ai_tutor(lecture_id: str, student_query: str):
    """
    Main entry point called by the /api/chat endpoint.
    Synchronous -- no async/Mongo plumbing needed.
    """
    context_text, matched_timestamps = _build_context(lecture_id, student_query)

    if context_text is None:
        return {
            "answer": f"I couldn't find any lecture data for ID '{lecture_id}'.",
            "timestamps": [],
        }

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {"error": "GROQ_API_KEY environment variable not found in .env file."}

    client = Groq(api_key=api_key)

    system_prompt = (
        "You are an expert AI Lecture Tutor. Answer the student's question using ONLY the "
        "provided lecture context below. If pseudocode or formulas are included in the context "
        "and relevant to the question, include them in your answer. Be concise and direct. "
        "If the answer truly cannot be found in the context, say so clearly rather than guessing."
    )

    user_prompt = f"Lecture context:\n{context_text}\n\nStudent question: {student_query}"

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
        )
        return {
            "answer": response.choices[0].message.content,
            "timestamps": matched_timestamps,
        }
    except Exception as e:
        return {"error": f"RAG chatbot failed: {str(e)}"}