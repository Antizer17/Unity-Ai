"""
transcribe.py

Transcribes an audio/video lecture file using Groq's Whisper API
and saves a normalized JSON file with timestamped segments.

Enhanced with large-file chunking support from NaeemRagFeat branch (Person C - Naeem).
Files larger than 24MB are automatically split into 10-minute chunks using pydub,
transcribed individually, and merged with cumulative time offsets.

Usage:
    python transcribe.py <audio_or_video_path> <lecture_id> [output_path]

Example:
    python transcribe.py sample_lecture.mp3 lecture_01
    python transcribe.py sample_lecture.mp4 lecture_01 lecture_01_transcript.json
"""

import sys
import json
import os
import io
from groq import Groq  
from dotenv import load_dotenv


load_dotenv()

# Maximum file size for single-pass Groq transcription (24MB)
MAX_SIZE_BYTES = 24 * 1024 * 1024


def transcribe_and_normalize(audio_path, lecture_id):
    """
    Transcribes an audio/video file and normalizes the output.
    
    - For files <= 24MB: Single-pass transcription via Groq Whisper
    - For files > 24MB: Splits into 10-minute chunks using pydub,
      transcribes each, and merges with correct time offsets
    
    Returns a normalized dict with:
        lecture_id, duration, language, fullText, segments[]
    """
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    file_size = os.path.getsize(audio_path)

    if file_size <= MAX_SIZE_BYTES:
        # -- Small file: Single-pass transcription --
        return _transcribe_single_pass(client, audio_path, lecture_id)
    else:
        # -- Large file: Chunked transcription --
        print(f"[SPLIT] Large file detected ({file_size / (1024*1024):.1f}MB). Splitting into chunks...")
        return _transcribe_chunked(client, audio_path, lecture_id)


def _transcribe_single_pass(client, audio_path, lecture_id):
    """Single-pass transcription for files under 24MB."""
    with open(audio_path, "rb") as audio_file:
        response = client.audio.transcriptions.create(
            file=(os.path.basename(audio_path), audio_file.read()),
            model="whisper-large-v3",
            response_format="verbose_json",
        )

    duration = getattr(response, "duration", 0.0)
    language = getattr(response, "language", "en")
    raw_segments = getattr(response, "segments", [])

    return _build_normalized_data(lecture_id, duration, language, raw_segments)


def _transcribe_chunked(client, audio_path, lecture_id):
    """
    Chunked transcription for files over 24MB.
    Uses pydub to split audio into 10-minute segments, transcribes each,
    and merges with cumulative time offsets.
    """
    try:
        from pydub import AudioSegment
    except ImportError:
        print("[WARN] pydub not installed. Attempting single-pass transcription for large file...")
        print("   Install pydub for proper large file support: pip install pydub")
        return _transcribe_single_pass(client, audio_path, lecture_id)

    # Determine format from file extension
    ext = os.path.splitext(audio_path)[1].replace(".", "").lower()
    if ext in ("mp4", "m4a", "webm"):
        # pydub can handle these with ffmpeg
        audio = AudioSegment.from_file(audio_path, format=ext)
    else:
        audio = AudioSegment.from_file(audio_path, format=ext)

    # Split into 10-minute structural segments (600,000 milliseconds)
    chunk_length_ms = 10 * 60 * 1000
    chunks = [audio[i:i + chunk_length_ms] for i in range(0, len(audio), chunk_length_ms)]

    print(f"[CHUNKS] Split into {len(chunks)} chunks of ~10 minutes each")

    all_segments = []
    segment_global_counter = 0
    cumulative_time_offset = 0.0
    detected_language = "en"

    for idx, chunk in enumerate(chunks):
        # Export chunk to MP3 in memory buffer (lightweight headers)
        buffer = io.BytesIO()
        chunk.export(buffer, format="mp3")
        buffer.name = f"chunk_{idx}.mp3"
        buffer.seek(0)

        try:
            print(f"  [MIC] Transcribing chunk {idx + 1}/{len(chunks)}...")
            response = client.audio.transcriptions.create(
                file=buffer,
                model="whisper-large-v3",
                response_format="verbose_json",
            )

            chunk_duration = getattr(response, "duration", 0.0)
            detected_language = getattr(response, "language", "en")
            raw_segments = getattr(response, "segments", [])

            for seg in raw_segments:
                local_start = seg.get("start") if isinstance(seg, dict) else getattr(seg, "start", 0.0)
                local_end = seg.get("end") if isinstance(seg, dict) else getattr(seg, "end", 0.0)
                local_text = seg.get("text") if isinstance(seg, dict) else getattr(seg, "text", "")

                all_segments.append({
                    "id": f"seg-{segment_global_counter}",
                    "startTime": cumulative_time_offset + local_start,
                    "endTime": cumulative_time_offset + local_end,
                    "text": local_text.strip(),
                })
                segment_global_counter += 1

            cumulative_time_offset += chunk_duration

        except Exception as e:
            print(f"  [ERROR] Error processing chunk {idx + 1}: {e}")
            continue

    total_duration = cumulative_time_offset
    full_text = " ".join([s["text"] for s in all_segments])

    return {
        "lecture_id": lecture_id,
        "duration": total_duration,
        "language": detected_language,
        "fullText": full_text,
        "segments": all_segments,
    }


def _build_normalized_data(lecture_id, duration, language, raw_segments):
    """Normalize raw Groq Whisper segments into our standard format."""
    normalized_data = {
        "lecture_id": lecture_id,
        "duration": duration,
        "language": language,
        "fullText": "",
        "segments": []
    }

    all_texts = []
    for seg in raw_segments:
        # Groq returns segments as dictionaries or objects
        seg_id = seg.get("id") if isinstance(seg, dict) else getattr(seg, "id", None)
        seg_str_id = f"seg-{seg_id}" if seg_id is not None else f"seg-{len(normalized_data['segments'])}"
        start = seg.get("start") if isinstance(seg, dict) else getattr(seg, "start", 0.0)
        end = seg.get("end") if isinstance(seg, dict) else getattr(seg, "end", 0.0)
        text = seg.get("text") if isinstance(seg, dict) else getattr(seg, "text", "")

        cleaned_text = text.strip()
        all_texts.append(cleaned_text)

        normalized_data["segments"].append({
            "id": seg_str_id,
            "startTime": start,
            "endTime": end,
            "text": cleaned_text,
        })

    normalized_data["fullText"] = " ".join(all_texts)
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

    if not os.environ.get("GROQ_API_KEY"):
        print("Error: GROQ_API_KEY environment variable not set.")
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
