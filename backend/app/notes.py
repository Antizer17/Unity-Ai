"""
notes.py

Generates structured, topic-organized notes from a normalized transcript JSON
(the output of transcribe.py), using an LLM.

Enhanced with features from feat/backend-integration branch (Person B):
- Upgraded to Llama 3.3 70B Versatile model for higher quality notes
- Smart chunking strategy: single-pass for short transcripts, two-pass for long ones
- Technical details extraction (pseudocode, formulas, algorithms)

Usage:
    python notes.py <transcript_json_path> [output_path]

Example:
    python notes.py lecture_01_transcript.json
    python notes.py lecture_01_transcript.json lecture_01_notes.json
"""

import sys
import json
import os
from datetime import datetime
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

AVAILABLE_MODELS = [
    os.getenv("GROQ_MODEL", "openai/gpt-oss-120b"),
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-20b",
    "llama-3.3-70b-versatile",
]


def decide_chunking_strategy(transcript: dict) -> dict:
    """
    Decides whether to use single-pass or two-pass notes generation
    based on transcript word count. From feat/backend-integration.
    """
    segments = transcript.get("segments", [])
    total_words = sum(len(seg.get("text", "").split()) for seg in segments)

    if total_words < 3000:
        return {"chunking": "single_pass", "total_words": total_words}
    else:
        return {"chunking": "two_pass", "total_words": total_words}


def generate_notes_from_transcript(transcript: dict) -> dict:
    """
    Main entry point — generates structured study notes from a transcript.
    
    Calls Groq to summarize the transcript segments into logical,
    structured study notes. Falls back to rule-based generation
    if the API is unavailable.
    
    Args:
        transcript: dict with 'lecture_id'/'lectureId', 'segments', etc.
        
    Returns:
        dict matching the frontend's Note interface
    """
    # Handle both field naming conventions
    lecture_id = transcript.get("lectureId") or transcript.get("lecture_id", "lec-unknown")
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
        print("[WARN] GROQ_API_KEY not found. Falling back to rule-based note generator.")
        return generate_fallback_notes(transcript)

    # Decide chunking strategy
    strategy = decide_chunking_strategy(transcript)
    print(f"[NOTES] Notes strategy: {strategy['chunking']} ({strategy['total_words']} words)")

    try:
        if strategy["chunking"] == "single_pass":
            return _generate_notes_single_pass(lecture_id, segments, api_key)
        else:
            return _generate_notes_two_pass(lecture_id, segments, api_key)
    except Exception as e:
        print(f"[ERROR] Error calling Groq for notes: {e}. Falling back to rule-based generator.")
        return generate_fallback_notes(transcript)


def _generate_notes_single_pass(lecture_id: str, segments: list, api_key: str) -> dict:
    """Single-pass notes generation for shorter transcripts (<3000 words)."""
    client = Groq(api_key=api_key)

    # Determine the correct time field names
    start_field = "startTime" if segments and "startTime" in segments[0] else "start"
    end_field = "endTime" if segments and "endTime" in segments[0] else "end"

    # Format transcript segments as timestamped context
    segments_text = "\n".join([
        f"[{seg.get(start_field, 0.0):.1f}s - {seg.get(end_field, 0.0):.1f}s] {seg.get('text', '')}"
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
        "      \"content\": \"Detailed study notes in Markdown format for this section, "
        "summarizing key concepts, equations, and definitions. Use bullet points and headers.\",\n"
        "      \"startTimestamp\": 0.0,\n"
        "      \"endTimestamp\": 60.0,\n"
        "      \"technical_details\": \"Reconstructed pseudocode, formulas, or numbered algorithm "
        "steps described verbally in this section. Empty string if none.\"\n"
        "    }\n"
        "  ]\n"
        "}\n"
        "Divide the lecture into 3-6 logical chapters/sections based on topic transitions. "
        "Assign startTimestamp and endTimestamp corresponding to when these topics were discussed. "
        "Use the actual timestamps from the transcript — do not invent timestamps."
    )

    user_prompt = f"Here is the lecture transcript:\n\n{segments_text}"

    # Try available models in order of priority
    response = None
    for model in AVAILABLE_MODELS:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.2,
            )
            break
        except Exception as e:
            err_str = str(e).lower()
            if "model_not_found" in err_str or "does not exist" in err_str or "404" in err_str:
                print(f"[WARN] Model '{model}' unavailable for notes, trying next model...")
                continue
            raise e

    if not response:
        raise RuntimeError("No available models succeeded in generating notes.")

    result_json = json.loads(response.choices[0].message.content)
    
    # Build standard NoteSection objects
    sections = []
    raw_sections = result_json.get("sections", []) if isinstance(result_json, dict) else (result_json if isinstance(result_json, list) else [])
    for i, sec in enumerate(raw_sections):
        if isinstance(sec, dict):
            sec_title = sec.get("title", f"Section {i+1}")
            sec_content = sec.get("content", "")
            sec_start = float(sec.get("startTimestamp", 0.0))
            sec_end = float(sec.get("endTimestamp", 0.0))
            sec_tech = sec.get("technical_details", "")
        elif isinstance(sec, str):
            sec_title = f"Section {i+1}"
            sec_content = sec
            sec_start = 0.0
            sec_end = 0.0
            sec_tech = ""
        else:
            continue

        sections.append({
            "id": f"sec-{lecture_id}-{i}",
            "title": sec_title,
            "content": sec_content,
            "startTimestamp": sec_start,
            "endTimestamp": sec_end,
            "orderIndex": i,
            "technical_details": sec_tech
        })

    summary_text = result_json.get("summary", "Study notes generated from lecture.") if isinstance(result_json, dict) else "Study notes generated from lecture."

    return {
        "id": f"note-{lecture_id}",
        "lectureId": lecture_id,
        "content": summary_text,
        "sections": sections,
        "generatedAt": datetime.utcnow().isoformat() + "Z"
    }


def _generate_notes_two_pass(lecture_id: str, segments: list, api_key: str) -> dict:
    """
    Two-pass notes generation for longer transcripts (>3000 words).
    
    Pass 1: Split segments into halves, generate notes for each
    Pass 2: Merge and deduplicate sections
    
    This avoids hitting Groq's context window limits on very long transcripts.
    """
    mid_point = len(segments) // 2
    first_half = segments[:mid_point]
    second_half = segments[mid_point:]

    # Generate notes for each half
    first_notes = _generate_notes_single_pass(lecture_id, first_half, api_key)
    second_notes = _generate_notes_single_pass(lecture_id, second_half, api_key)

    # Merge sections from both halves
    all_sections = first_notes.get("sections", []) + second_notes.get("sections", [])
    
    # Re-index sections
    for i, section in enumerate(all_sections):
        section["id"] = f"sec-{lecture_id}-{i}"
        section["orderIndex"] = i

    return {
        "id": f"note-{lecture_id}",
        "lectureId": lecture_id,
        "content": first_notes.get("content", "Study notes generated from lecture."),
        "sections": all_sections,
        "generatedAt": datetime.utcnow().isoformat() + "Z"
    }


def generate_fallback_notes(transcript: dict) -> dict:
    """
    Fall back to a programmatic rule-based notes partition when Groq is unavailable.
    """
    lecture_id = transcript.get("lectureId") or transcript.get("lecture_id", "lec-unknown")
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

    # Determine the correct time field names
    start_field = "startTime" if segments and "startTime" in segments[0] else "start"
    end_field = "endTime" if segments and "endTime" in segments[0] else "end"

    segs_per_section = len(segments) // section_count
    sections = []

    for i in range(section_count):
        start_idx = i * segs_per_section
        end_idx = len(segments) if i == section_count - 1 else (i + 1) * segs_per_section
        section_segs = segments[start_idx:end_idx]

        start_time = section_segs[0].get(start_field, 0.0)
        end_time = section_segs[-1].get(end_field, 0.0)

        text_content = "\n".join([f"* {s.get('text', '')}" for s in section_segs])

        sections.append({
            "id": f"sec-{lecture_id}-{i}",
            "title": f"Part {i+1}: Topic Overview",
            "content": f"### Key Points Discussed\n\n{text_content}\n\n*Note: This section was compiled automatically by the system.*",
            "startTimestamp": start_time,
            "endTimestamp": end_time,
            "orderIndex": i,
            "technical_details": ""
        })

    return {
        "id": f"note-{lecture_id}",
        "lectureId": lecture_id,
        "content": f"Study notes for lecture {lecture_id} covering the key concepts discussed by the speaker.",
        "sections": sections,
        "generatedAt": datetime.utcnow().isoformat() + "Z"
    }


# --- CLI Interface -------------------------------------------------------------

def main():
    if len(sys.argv) < 2:
        print("Usage: python notes.py <transcript_json_path> [output_path]")
        sys.exit(1)

    transcript_path = sys.argv[1]

    if not os.path.exists(transcript_path):
        print(f"Error: file not found: {transcript_path}")
        sys.exit(1)

    if not os.environ.get("GROQ_API_KEY"):
        print("Error: GROQ_API_KEY environment variable not set.")
        sys.exit(1)

    with open(transcript_path, "r") as f:
        transcript_json = json.load(f)

    lecture_id = transcript_json.get("lecture_id", "lecture")
    output_path = sys.argv[2] if len(sys.argv) > 2 else f"{lecture_id}_notes.json"

    print(f"Generating notes from {transcript_path} ...")
    notes = generate_notes_from_transcript(transcript_json)

    with open(output_path, "w") as f:
        json.dump(notes, f, indent=2)

    print(f"Done. {len(notes.get('sections', []))} sections found.")
    print(f"Saved to: {output_path}")


if __name__ == "__main__":
    main()
