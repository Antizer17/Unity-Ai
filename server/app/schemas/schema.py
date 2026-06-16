from pydantic import BaseModel, Field
from typing import List, Optional

# ==========================================
# 1. CANONICAL TRANSCRIPT SCHEMAS
# ==========================================

class UtteranceSegment(BaseModel):
    speaker: str = Field(..., description="Speaker label")
    start: float = Field(..., description="Start time of the segment in seconds")
    end: float = Field(..., description="End time of the segment in seconds")
    text: str = Field(..., description="The transcribed text")

class CanonicalTranscript(BaseModel):
    lecture_id: str = Field(..., description="Unique identifier for the lecture")
    title: Optional[str] = Field("Untitled Lecture", description="Title of the lecture")
    duration: float = Field(..., description="Total duration in seconds")
    full_text: str = Field(..., description="Continuous string text")
    segments: List[UtteranceSegment] = Field(..., description="List of text segments")


# ==========================================
# 2. STRUCTURED NOTES SCHEMAS (Matched to notes.py)
# ==========================================

class LectureTopic(BaseModel):
    title: str = Field(..., description="Short topic title")
    start: float = Field(..., description="Start timestamp in seconds")
    end: float = Field(..., description="End timestamp in seconds")
    summary: str = Field(..., description="1-2 sentence overview")
    key_points: List[str] = Field(..., description="Bullet points for studying")
    technical_details: Optional[str] = Field("", description="Reconstructed pseudocode, formulas, or steps")

class StructuredNotes(BaseModel):
    lecture_id: str = Field(..., description="Unique identifier matching parent transcript")
    topics: List[LectureTopic] = Field(..., description="Deep-dive breakdown of the lesson topics")