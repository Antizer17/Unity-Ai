"""
notes.py

Generates structured, topic-organized notes from a normalized transcript JSON
(the output of transcribe.py), using an LLM.

Usage:
    python notes.py <transcript_json_path> [output_path]

Example:
    python notes.py lecture_01_transcript.json
    python notes.py lecture_01_transcript.json lecture_01_notes.json
"""

import sys
import json
import os
from dotenv import load_dotenv
from google import genai

"""
notes.py

Generates structured, topic-organized notes from a normalized transcript JSON
(the output of transcribe.py), using an LLM.

Usage:
    python notes.py <transcript_json_path> [output_path]

Example:
    python notes.py lecture_01_transcript.json
    python notes.py lecture_01_transcript.json lecture_01_notes.json
"""
load_dotenv()
api_key=os.getenv("GROQ_API_KEY")

"""
notes.py

Generates structured, topic-organized notes from a normalized transcript JSON
(the output of transcribe.py), using an LLM.

Usage:
    python notes.py <transcript_json_path> [output_path]

Example:
    python notes.py lecture_01_transcript.json
    python notes.py lecture_01_transcript.json lecture_01_notes.json
"""

import sys
import json
import os
from groq import Groq

client = Groq(api_key=api_key)  # reads GROQ_API_KEY from environment

MODEL = "llama-3.3-70b-versatile"  # fixed model choice for notes generation


def decide_chunking_strategy(transcript_json):
    segments = transcript_json["segments"]
    total_words = sum(len(seg["text"].split()) for seg in segments)

    if total_words < 3000:
        return {"chunking": "single_pass", "total_words": total_words}
    else:
        return {"chunking": "two_pass", "total_words": total_words}


def generate_notes_single_pass(transcript_json):
    segments = transcript_json["segments"]
    lecture_id = transcript_json["lecture_id"]

    segments_text = "\n".join(
        f"[{seg['start']:.1f}-{seg['end']:.1f}] {seg['text']}"
        for seg in segments
    )

    prompt = f"""You are an expert at converting lecture transcripts into structured study notes.

Below is a timestamped lecture transcript. Identify natural topic sections and produce structured notes.

TRANSCRIPT:
{segments_text}

Return ONLY valid JSON (no markdown, no explanation) in exactly this format:
{{
  "topics": [
    {{
      "title": "short topic title",
      "start": <number, start timestamp in seconds from the first segment in this topic>,
      "end": <number, end timestamp in seconds from the last segment in this topic>,
      "summary": "1-2 sentence overview",
      "key_points": ["point 1", "point 2", "point 3"],
      "technical_details": "Reconstructed pseudocode, formulas, or numbered algorithm steps described verbally in this section. Empty string if none."
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
        print("Raw output was:")
        print(raw_output)
        raise e

    notes["lecture_id"] = lecture_id
    return notes


def generate_notes(transcript_json):
    strategy = decide_chunking_strategy(transcript_json)
    print(f"Chunking strategy: {strategy['chunking']} ({strategy['total_words']} words)")

    if strategy["chunking"] == "single_pass":
        return generate_notes_single_pass(transcript_json)
    else:
        # Not implemented yet -- only build this if you actually hit a long transcript
        print("WARNING: two_pass chunking not implemented yet. Falling back to single_pass.")
        return generate_notes_single_pass(transcript_json)


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
    notes = generate_notes(transcript_json)

    with open(output_path, "w") as f:
        json.dump(notes, f, indent=2)

    print(f"Done. {len(notes['topics'])} topics found.")
    print(f"Saved to: {output_path}")


if __name__ == "__main__":
    main()