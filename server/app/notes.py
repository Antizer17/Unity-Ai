"""
notes.py

Generates structured, topic-organized notes from a normalized transcript JSON
(the output of transcribe.py), using Groq (Llama 3.3 70B).
"""

import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq()  # reads GROQ_API_KEY from environment
MODEL = "llama-3.3-70b-versatile"


def decide_chunking_strategy(transcript_json):
    segments = transcript_json["segments"]
    total_words = sum(len(seg["text"].split()) for seg in segments)
    if total_words < 3000:
        return {"chunking": "single_pass", "total_words": total_words}
    else:
        return {"chunking": "two_pass", "total_words": total_words}


def generate_notes_single_pass(transcript_json):
    segments = transcript_json["segments"]
    lecture_id = transcript_json.get("lecture_id", "lec-unknown")

    segments_text = "\n".join(
        f"[{seg['start']:.1f}-{seg['end']:.1f}] {seg['text']}"
        for seg in segments
    )

    prompt = f"""You are an expert at converting lecture transcripts into structured study notes.

Below is a timestamped lecture transcript. Identify natural topic sections and produce structured notes.

Pay special attention to any algorithms, code, pseudocode, formulas, equations, or step-by-step procedures that the speaker describes verbally — even if no visual diagram or code is shown, professors often narrate the actual steps out loud. Reconstruct these as clean, code-style pseudocode in the "technical_details" field. If a topic has no such content, leave "technical_details" as an empty string.

TRANSCRIPT:
{segments_text}

Return ONLY valid JSON (no markdown, no explanation) in exactly this format:
{{
  "topics": [
    {{
      "title": "short topic title",
      "start": <number>,
      "end": <number>,
      "summary": "1-2 sentence overview",
      "key_points": ["point 1", "point 2", "point 3"],
      "technical_details": "Reconstructed pseudocode/formulas, or empty string."
    }}
  ]
}}

Use the actual timestamps from the transcript segments above. Do not invent timestamps."""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        response_format={"type": "json_object"},
    )

    raw_output = response.choices[0].message.content.strip()
    raw_output = raw_output.removeprefix("```json").removesuffix("```").strip()

    try:
        notes = json.loads(raw_output)
    except json.JSONDecodeError as e:
        print("ERROR: Failed to parse LLM output as JSON.")
        print("Raw output was:", raw_output)
        raise e

    notes["lecture_id"] = lecture_id
    return notes


def generate_notes(transcript_json):
    strategy = decide_chunking_strategy(transcript_json)
    print(f"Chunking strategy: {strategy['chunking']} ({strategy['total_words']} words)")

    if strategy["chunking"] == "single_pass":
        return generate_notes_single_pass(transcript_json)
    else:
        print("WARNING: two_pass chunking not implemented yet. Falling back to single_pass.")
        return generate_notes_single_pass(transcript_json)


# Alias so app/main.py's import (generate_notes_from_transcript) works
generate_notes_from_transcript = generate_notes