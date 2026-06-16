import sys
import json
import os
import io
from groq import Groq  
from dotenv import load_dotenv
from pydub import AudioSegment  # Handles millisecond structural slicing safely

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(base_dir, ".env")
load_dotenv(dotenv_path=env_path)

def transcribe_and_normalize(audio_path, lecture_id):
    api_key = os.getenv("GROQ_API_KEY")
    client = Groq(api_key=api_key)  

    file_size = os.path.getsize(audio_path)
    MAX_SIZE_BYTES = 24 * 1024 * 1024 

    normalized_data = {
        "lecture_id": lecture_id,
        "duration": 0.0,
        "language": "en",
        "segments": []
    }

    if file_size <= MAX_SIZE_BYTES:
        with open(audio_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                file=(os.path.basename(audio_path), audio_file.read()),
                model="whisper-large-v3",
                response_format="verbose_json",
            )
        normalized_data["duration"] = getattr(response, "duration", 0.0)
        normalized_data["language"] = getattr(response, "language", "en")
        raw_segments = getattr(response, "segments", [])
        
        for seg in raw_segments:
            normalized_data["segments"].append({
                "id": seg.get("id") if isinstance(seg, dict) else getattr(seg, "id", None),
                "start": seg.get("start") if isinstance(seg, dict) else getattr(seg, "start", 0.0),
                "end": seg.get("end") if isinstance(seg, dict) else getattr(seg, "end", 0.0),
                "text": (seg.get("text") if isinstance(seg, dict) else getattr(seg, "text", "")).strip(),
            })
        return normalized_data

    else:
        print("Large file encountered. Slicing audio track structurally using pydub...")
        # Automatically determine format type extension (.mp3, .wav, etc.)
        ext = os.path.splitext(audio_path)[1].replace(".", "").lower()
        audio = AudioSegment.from_file(audio_path, format=ext)
        
        # Split into 10-minute structural segments (600,000 milliseconds)
        chunk_length_ms = 10 * 60 * 1000 
        chunks = [audio[i:i + chunk_length_ms] for i in range(0, len(audio), chunk_length_ms)]
        
        segment_global_counter = 0
        cumulative_time_offset = 0.0
        
        for idx, chunk in enumerate(chunks):
            # Export structurally sound chunk with proper file headers into a memory buffer
            buffer = io.BytesIO()
            chunk.export(buffer, format="mp3") # Exporting as MP3 creates lightweight headers
            buffer.name = f"chunk_{idx}.mp3"
            buffer.seek(0)
            
            try:
                response = client.audio.transcriptions.create(
                    file=buffer,
                    model="whisper-large-v3",
                    response_format="verbose_json",
                )
                
                chunk_duration = getattr(response, "duration", 0.0)
                normalized_data["language"] = getattr(response, "language", "en")
                raw_segments = getattr(response, "segments", [])
                
                for seg in raw_segments:
                    local_start = seg.get("start") if isinstance(seg, dict) else getattr(seg, "start", 0.0)
                    local_end = seg.get("end") if isinstance(seg, dict) else getattr(seg, "end", 0.0)
                    local_text = seg.get("text") if isinstance(seg, dict) else getattr(seg, "text", "")
                    
                    normalized_data["segments"].append({
                        "id": segment_global_counter,
                        "start": cumulative_time_offset + local_start,
                        "end": cumulative_time_offset + local_end,
                        "text": local_text.strip(),
                    })
                    segment_global_counter += 1
                
                cumulative_time_offset += chunk_duration
                
            except Exception as e:
                print(f"Error processing audio chunk: {e}")
                continue
                
        normalized_data["duration"] = cumulative_time_offset
        return normalized_data