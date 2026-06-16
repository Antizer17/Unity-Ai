import type {
  User,
  Lecture,
  Transcript,
  Note,
  ChatSession,
  ChatMessage,
  ApiResponse,
  PaginatedResponse,
} from '@/types';
import {
  mockUser,
  mockLectures,
  mockTranscript,
  mockNotes,
  mockChatSession,
  mockChatMessages,
} from '@/lib/mock-data';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

/** Simulate network latency */
function delay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Generic fetch wrapper (will replace mock data later) */
async function apiFetch<T>(
  _endpoint: string,
  _options?: RequestInit
): Promise<ApiResponse<T>> {
  // TODO: Replace with real fetch call
  // const res = await fetch(`${BASE_URL}${endpoint}`, {
  //   headers: { 'Content-Type': 'application/json', ...options?.headers },
  //   ...options,
  // });
  // const data = await res.json();
  // return data;
  void _endpoint;
  void _options;
  void BASE_URL;
  throw new Error('Not implemented — use specific mock methods below');
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    void email;
    void password;
    await delay();
    return {
      success: true,
      data: { user: mockUser, token: 'mock-jwt-token-xyz' },
    };
  },

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    void password;
    await delay();
    return {
      success: true,
      data: {
        user: { ...mockUser, name, email, id: 'user-new' },
        token: 'mock-jwt-token-new',
      },
    };
  },

  async getProfile(): Promise<ApiResponse<User>> {
    await delay();
    return { success: true, data: mockUser };
  },
};

// ─── Lectures API ─────────────────────────────────────────────────────────────

export const lecturesApi = {
  async getAll(
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<Lecture>> {
    await delay();
    return {
      success: true,
      data: mockLectures,
      items: mockLectures,
      total: mockLectures.length,
      page,
      pageSize,
    };
  },

  async getById(id: string): Promise<ApiResponse<Lecture>> {
    await delay();
    const lecture = mockLectures.find((l) => l.id === id) ?? mockLectures[0];
    return { success: true, data: lecture };
  },

  async create(formData: FormData): Promise<ApiResponse<Lecture>> {
    void formData;
    await delay(1500);
    return {
      success: true,
      data: {
        ...mockLectures[0],
        id: `lec-${Date.now()}`,
        status: 'UPLOADING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    void id;
    await delay();
    return { success: true, data: null };
  },
};

// ─── Transcripts API ──────────────────────────────────────────────────────────

export const transcriptsApi = {
  async getByLectureId(lectureId: string): Promise<ApiResponse<Transcript>> {
    void lectureId;
    await delay();
    return { success: true, data: mockTranscript };
  },
};

// ─── Notes API ────────────────────────────────────────────────────────────────

export const notesApi = {
  async getByLectureId(lectureId: string): Promise<ApiResponse<Note>> {
    void lectureId;
    await delay();
    return { success: true, data: mockNotes };
  },

  async regenerate(lectureId: string): Promise<ApiResponse<Note>> {
    void lectureId;
    await delay(2000);
    return {
      success: true,
      data: { ...mockNotes, generatedAt: new Date().toISOString() },
    };
  },
};

// ─── Chat API ─────────────────────────────────────────────────────────────────

export const chatApi = {
  async createSession(
    lectureId: string
  ): Promise<ApiResponse<ChatSession>> {
    void lectureId;
    await delay();
    return {
      success: true,
      data: {
        id: `chat-${Date.now()}`,
        lectureId,
        messages: [],
        createdAt: new Date().toISOString(),
      },
    };
  },

  async sendMessage(
    sessionId: string,
    content: string
  ): Promise<ApiResponse<ChatMessage>> {
    void sessionId;
    void content;
    await delay(1200);
    // Return a mock assistant response
    return {
      success: true,
      data: mockChatMessages[1], // reuse an existing assistant message
    };
  },

  async getHistory(
    sessionId: string
  ): Promise<ApiResponse<ChatSession>> {
    void sessionId;
    await delay();
    return { success: true, data: mockChatSession };
  },
};

// ─── Unified API Client ──────────────────────────────────────────────────────

export const api = {
  auth: authApi,
  lectures: lecturesApi,
  transcripts: transcriptsApi,
  notes: notesApi,
  chat: chatApi,
  /** Direct fetch (for future use) */
  fetch: apiFetch,
};

export default api;
