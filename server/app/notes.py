import os
import json
from datetime import datetime
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def generate_notes_from_transcript(transcript: dict) -> dict:
    """
    Calls Groq to summarize the transcript segments into logical, structured study notes.
    """
    lecture_id = transcript.get("lecture_id", "lec-unknown")
    segments = transcript.get("segments", [])
    
    if not segments:
        return {
            "id": f"note-{lecture_id}",
            "lectureId": lecture_id,
            "content": "No transcription segments available to generate notes.",
            "sections": [],
            "generatedAt": datetime.utcnow().isoformat() + "Z"
        }

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("Warning: GROQ_API_KEY not found in environment. Falling back to rule-based note generator.")
        return generate_fallback_notes(transcript)
        
    try:
        client = Groq(api_key=api_key)
        
        # Format transcript segments as context
        transcript_text = "\n".join([
            f"[{seg['startTime']:.1f}s - {seg['endTime']:.1f}s] {seg['text']}"
            for seg in segments
        ])
        
        system_prompt = (
            "You are an expert academic tutor. Analyze the transcription of a lecture and generate "
            "comprehensive, structured study notes. You must output a valid JSON object. "
            "The JSON object must have exactly this structure:\n"
            "{\n"
            "  \"summary\": \"Brief 1-2 sentence overall summary of the lecture.\",\n"
            "  \"sections\": [\n"
            "    {\n"
            "      \"title\": \"Section Title (e.g., Introduction to Calculus)\",\n"
            "      \"content\": \"Detailed study notes in Markdown format for this section, summarizing key concepts, equations, and definitions. Use bullet points and headers where appropriate.\",\n"
            "      \"startTimestamp\": 0.0,\n"
            "      \"endTimestamp\": 60.0\n"
            "    }\n"
            "  ]\n"
            "}\n"
            "Divide the lecture into 3-5 logical chapters/sections based on time. Assign startTimestamp and endTimestamp "
            "corresponding to when these topics were discussed in the transcript."
        )
        
        user_prompt = f"Here is the lecture transcript:\n\n{transcript_text}"
        
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
        )
        
        result_json = json.loads(response.choices[0].message.content)
        
        # Build standard NoteSection objects
        sections = []
        for i, sec in enumerate(result_json.get("sections", [])):
            sections.append({
                "id": f"sec-{lecture_id}-{i}",
                "title": sec.get("title", f"Section {i+1}"),
                "content": sec.get("content", ""),
                "startTimestamp": float(sec.get("startTimestamp", 0.0)),
                "endTimestamp": float(sec.get("endTimestamp", 0.0)),
                "orderIndex": i
            })
            
        return {
            "id": f"note-{lecture_id}",
            "lectureId": lecture_id,
            "content": result_json.get("summary", "Study notes generated from lecture."),
            "sections": sections,
            "generatedAt": datetime.utcnow().isoformat() + "Z"
        }
        
    except Exception as e:
        print(f"Error calling Groq for notes: {e}. Falling back to rule-based note generator.")
        return generate_fallback_notes(transcript)

def generate_fallback_notes(transcript: dict) -> dict:
    """
    Fall back to a programmatic rule-based notes partition when Groq is unavailable.
    """
    lecture_id = transcript.get("lecture_id", "lec-unknown")
    segments = transcript.get("segments", [])
    
    section_count = min(3, len(segments))
    if section_count <= 0:
        return {
            "id": f"note-{lecture_id}",
            "lectureId": lecture_id,
            "content": "No segments available.",
            "sections": [],
            "generatedAt": datetime.utcnow().isoformat() + "Z"
        }
        
    segs_per_section = len(segments) // section_count
    sections = []
    
    for i in range(section_count):
        start_idx = i * segs_per_section
        end_idx = len(segments) if i == section_count - 1 else (i + 1) * segs_per_section
        section_segs = segments[start_idx:end_idx]
        
        start_time = section_segs[0]["startTime"]
        end_time = section_segs[-1]["endTime"]
        
        text_content = "\n".join([f"* {s['text']}" for s in section_segs])
        
        sections.append({
            "id": f"sec-{lecture_id}-{i}",
            "title": f"Part {i+1}: Topic Overview",
            "content": f"### Key Points Discussed\n\n{text_content}\n\n*Note: This section note was compiled automatically by the system.*",
            "startTimestamp": start_time,
            "endTimestamp": end_time,
            "orderIndex": i
        })
        
    return {
        "id": f"note-{lecture_id}",
        "lectureId": lecture_id,
        "content": f"Study notes for lecture {lecture_id} covering the key concepts discussed by the speaker.",
        "sections": sections,
        "generatedAt": datetime.utcnow().isoformat() + "Z"
    }
