// ─── Unity-AI Type Definitions ────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'ADMIN';
  avatarUrl?: string;
  createdAt: string;
}

export type LectureStatus =
  | 'UPLOADING'
  | 'PROCESSING'
  | 'TRANSCRIBING'
  | 'GENERATING_NOTES'
  | 'READY'
  | 'FAILED';

export interface Lecture {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  thumbnailUrl?: string;
  duration: number; // seconds
  status: LectureStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TranscriptSegment {
  id: string;
  text: string;
  startTime: number; // seconds
  endTime: number; // seconds
}

export interface Transcript {
  id: string;
  lectureId: string;
  fullText: string;
  language: string;
  segments: TranscriptSegment[];
}

export interface NoteSection {
  id: string;
  title: string;
  content: string;
  startTimestamp: number; // seconds
  endTimestamp: number; // seconds
  orderIndex: number;
}

export interface Note {
  id: string;
  lectureId: string;
  content: string;
  sections: NoteSection[];
  generatedAt: string;
}

export interface Citation {
  segmentId: string;
  text: string;
  startTime: number;
  endTime: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  createdAt: string;
}

export interface ChatSession {
  id: string;
  lectureId: string;
  messages: ChatMessage[];
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
