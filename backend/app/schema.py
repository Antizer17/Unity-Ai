"""
schema.py

Pydantic validation schemas for transcript and notes data structures.
Adapted from feat/backend-integration branch (Person B) to work with
our existing JSON field naming conventions.
"""

from pydantic import BaseModel, Field
from typing import List, Optional


# ==========================================
# 1. TRANSCRIPT SCHEMAS
# ==========================================

class UtteranceSegment(BaseModel):
    """A single timestamped segment from the transcription."""
    id: str = Field(..., description="Segment identifier (e.g., 'seg-0')")
    startTime: float = Field(..., description="Start time of the segment in seconds")
    endTime: float = Field(..., description="End time of the segment in seconds")
    text: str = Field(..., description="The transcribed text")


class CanonicalTranscript(BaseModel):
    """
    Validated transcript structure matching our frontend's Transcript interface.
    Used to validate data from the transcription pipeline before storage.
    """
    lecture_id: str = Field(..., description="Unique identifier for the lecture")
    duration: float = Field(0.0, description="Total duration in seconds")
    language: str = Field("en", description="Detected language code")
    fullText: Optional[str] = Field(None, description="Continuous full text of the lecture")
    segments: List[UtteranceSegment] = Field(default_factory=list, description="List of timestamped text segments")


# ==========================================
# 2. STRUCTURED NOTES SCHEMAS
# ==========================================

class NoteSection(BaseModel):
    """A single topic section within the generated study notes."""
    id: str = Field(..., description="Section identifier")
    title: str = Field(..., description="Short topic title")
    content: str = Field(..., description="Markdown-formatted study notes for this section")
    startTimestamp: float = Field(0.0, description="Start timestamp in seconds")
    endTimestamp: float = Field(0.0, description="End timestamp in seconds")
    orderIndex: int = Field(0, description="Ordering index for display")
    technical_details: Optional[str] = Field("", description="Reconstructed pseudocode or formulas")


class StructuredNotes(BaseModel):
    """
    Validated notes structure matching our frontend's Note interface.
    Used to validate data from the notes generation pipeline before storage.
    """
    id: str = Field(..., description="Notes identifier")
    lectureId: str = Field(..., description="Unique identifier matching parent transcript")
    content: str = Field("", description="Brief overall summary of the notes")
    sections: List[NoteSection] = Field(default_factory=list, description="Structured topic sections")
    generatedAt: str = Field("", description="ISO timestamp of when notes were generated")


# ==========================================
# 3. CHAT / RAG REQUEST SCHEMAS
# ==========================================

class ChatRequest(BaseModel):
    """Request body for the AI tutor chat endpoint."""
    lecture_id: str = Field(..., description="The lecture to query against")
    question: str = Field(..., description="The student's question")


class TimestampReference(BaseModel):
    """A timestamp reference returned by the RAG pipeline."""
    start: float = Field(..., description="Start time in seconds")
    end: float = Field(..., description="End time in seconds")
    formatted: str = Field("", description="Human-readable time (e.g., [01:05])")


class ChatResponse(BaseModel):
    """Response body from the AI tutor chat endpoint."""
    answer: str = Field(..., description="The AI-generated answer")
    timestamps: List[TimestampReference] = Field(default_factory=list, description="Relevant timestamps from the lecture")
