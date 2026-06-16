"""
rag.py

Retrieval-Augmented Generation (RAG) pipeline for the AI Lecture Tutor using ChromaDB.
"""

import os
import json
import chromadb
from chromadb.utils import embedding_functions
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
CHROMA_DIR = os.path.join(DATA_DIR, "chroma")
os.makedirs(CHROMA_DIR, exist_ok=True)

# Initialize ChromaDB Persistent Client
chroma_client = chromadb.PersistentClient(path=CHROMA_DIR)

# Default embedding function (all-MiniLM-L6-v2)
embedding_fn = embedding_functions.DefaultEmbeddingFunction()

def get_lecture_collection(lecture_id: str):
    col_name = f"collection_{lecture_id.replace('-', '_')}"
    return chroma_client.get_or_create_collection(
        name=col_name,
        embedding_function=embedding_fn
    )

def index_lecture_transcript(lecture_id: str):
    """
    Parses transcript and notes, generates embeddings, and stores in ChromaDB.
    """
    transcript_path = os.path.join(DATA_DIR, f"{lecture_id}_transcript.json")
    notes_path = os.path.join(DATA_DIR, f"{lecture_id}_notes.json")
    
    documents = []
    metadatas = []
    ids = []
    
    # 1. Index Notes Topics (higher quality summaries)
    if os.path.exists(notes_path):
        try:
            with open(notes_path, "r", encoding="utf-8") as f:
                notes_data = json.load(f)
                for i, topic in enumerate(notes_data.get("topics", [])):
                    text = f"Topic: {topic.get('title', '')}\nSummary: {topic.get('summary', '')}"
                    if topic.get("key_points"):
                        text += "\nKey points: " + "; ".join(topic["key_points"])
                    documents.append(text)
                    metadatas.append({
                        "type": "note",
                        "start": float(topic.get("start", 0.0)),
                        "end": float(topic.get("end", 0.0)),
                        "label": topic.get("title", "")
                    })
                    ids.append(f"note_{i}")
        except Exception as e:
            print(f"[WARN] Failed to index notes for {lecture_id}: {e}")

    # 2. Index Transcript Segments
    if os.path.exists(transcript_path):
        try:
            with open(transcript_path, "r", encoding="utf-8") as f:
                transcript_data = json.load(f)
                segments = transcript_data.get("segments", [])
                
                chunk_text = ""
                chunk_start = 0.0
                chunk_end = 0.0
                chunk_idx = 0
                
                start_field = "startTime" if segments and "startTime" in segments[0] else "start"
                end_field = "endTime" if segments and "endTime" in segments[0] else "end"
                
                for i, seg in enumerate(segments):
                    text = seg.get("text", "")
                    start = float(seg.get(start_field, 0.0))
                    end = float(seg.get(end_field, 0.0))
                    
                    if chunk_text == "":
                        chunk_start = start
                        
                    chunk_text += text + " "
                    chunk_end = end
                    
                    if (i + 1) % 3 == 0 or i == len(segments) - 1:
                        documents.append(chunk_text.strip())
                        
                        minutes = int(chunk_start // 60)
                        seconds = int(chunk_start % 60)
                        
                        metadatas.append({
                            "type": "transcript",
                            "start": chunk_start,
                            "end": chunk_end,
                            "label": f"[{minutes:02d}:{seconds:02d}] Transcript"
                        })
                        ids.append(f"transcript_{chunk_idx}")
                        
                        chunk_text = ""
                        chunk_idx += 1
                        
        except Exception as e:
            print(f"[WARN] Failed to index transcript for {lecture_id}: {e}")

    if documents:
        try:
            collection = get_lecture_collection(lecture_id)
            collection.upsert(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            print(f"[OK] RAG: Successfully indexed {len(documents)} chunks in ChromaDB for {lecture_id}")
            return True
        except Exception as e:
            print(f"[ERROR] RAG: ChromaDB upsert failed for {lecture_id}: {e}")
            return False
            
    print(f"[WARN] RAG: No content found to index for {lecture_id}")
    return False

def query_ai_tutor(lecture_id: str, student_query: str) -> dict:
    """
    Main RAG query function using ChromaDB.
    """
    try:
        collection = get_lecture_collection(lecture_id)
        
        # Query ChromaDB for top 5 most relevant chunks
        results = collection.query(
            query_texts=[student_query],
            n_results=5
        )
        
        if not results["documents"] or not results["documents"][0]:
            return {
                "answer": f"I couldn't find relevant information in the lecture for your question.",
                "timestamps": []
            }
            
        retrieved_docs = results["documents"][0]
        retrieved_metadatas = results["metadatas"][0]
        
        context_text = ""
        matched_timestamps = []
        
        for i in range(len(retrieved_docs)):
            doc = retrieved_docs[i]
            meta = retrieved_metadatas[i]
            
            context_text += f"\n[{meta['start']:.1f}s - {meta['end']:.1f}s]: {doc}"
            
            minutes = int(meta['start'] // 60)
            seconds = int(meta['start'] % 60)
            formatted_time = f"[{minutes:02d}:{seconds:02d}]"
            
            matched_timestamps.append({
                "start": meta["start"],
                "end": meta["end"],
                "formatted": formatted_time
            })
            
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return {
                "answer": "I'm unable to process your question right now because the AI service is not configured.",
                "timestamps": matched_timestamps
            }

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
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3
        )

        return {
            "answer": response.choices[0].message.content,
            "timestamps": matched_timestamps[:3]
        }

    except Exception as e:
        print(f"[ERROR] RAG processing failed: {str(e)}")
        return {
            "answer": f"I encountered an error while processing your question: {str(e)}",
            "timestamps": []
        }

def query_general_tutor(student_query: str) -> dict:
    """
    General-purpose AI tutor for guest chat mode (no specific lecture context).
    Uses Groq LLM to answer general study questions.
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
            model="llama-3.3-70b-versatile",
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
