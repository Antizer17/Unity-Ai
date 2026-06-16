"""
transcribe.py

Transcribes an audio/video lecture file using OpenAI's Whisper API
and saves a normalized JSON file with timestamped segments.

Usage:
    python transcribe.py <audio_or_video_path> <lecture_id> [output_path]

Example:
    python transcribe.py sample_lecture.mp3 lecture_01
    python transcribe.py sample_lecture.mp4 lecture_01 lecture_01_transcript.json
"""

import sys
import json
import os
from groq import Groq  
from dotenv import load_dotenv


load_dotenv()

def transcribe_and_normalize(audio_path, lecture_id):
    # Initialize the free Groq client
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))  

    with open(audio_path, "rb") as audio_file:
        # Groq uses whisper-large-v3, which is highly accurate!
        response = client.audio.transcriptions.create(
            file=(os.path.basename(audio_path), audio_file.read()),
            model="whisper-large-v3",
            response_format="verbose_json",  # Gives you the timestamps!
        )

    duration = getattr(response, "duration", 0.0)
    language = getattr(response, "language", "en")
    raw_segments = getattr(response, "segments", [])

    normalized_data = {
        "lecture_id": lecture_id,
        "duration": duration,
        "language": language,
        "segments": []
    }

    for seg in raw_segments:
        # Groq returns segments as dictionaries
        seg_id = seg.get("id") if isinstance(seg, dict) else getattr(seg, "id", None)
        start = seg.get("start") if isinstance(seg, dict) else getattr(seg, "start", 0.0)
        end = seg.get("end") if isinstance(seg, dict) else getattr(seg, "end", 0.0)
        text = seg.get("text") if isinstance(seg, dict) else getattr(seg, "text", "")

        normalized_data["segments"].append({
            "id": seg_id,
            "start": start,
            "end": end,
            "text": text.strip(),
        })

    return normalized_data


def main():
    if len(sys.argv) < 3:
        print("Usage: python transcribe.py <audio_or_video_path> <lecture_id> [output_path]")
        sys.exit(1)

    audio_path = sys.argv[1]
    lecture_id = sys.argv[2]
    output_path = sys.argv[3] if len(sys.argv) > 3 else f"{lecture_id}_transcript.json"

    if not os.path.exists(audio_path):
        print(f"Error: file not found: {audio_path}")
        sys.exit(1)

    if not os.environ.get("OPENAI_API_KEY"):
        print("Error: OPENAI_API_KEY environment variable not set.")
        print("Run: export OPENAI_API_KEY='your-key-here'")
        sys.exit(1)

    print(f"Transcribing {audio_path} ...")
    result = transcribe_and_normalize(audio_path, lecture_id)

    with open(output_path, "w") as f:
        json.dump(result, f, indent=2)

    print(f"Done. {len(result['segments'])} segments found.")
    print(f"Duration: {result['duration']:.1f}s, Language: {result['language']}")
    print(f"Saved to: {output_path}")


if __name__ == "__main__":
    main()
