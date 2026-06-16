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
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const isFormData = options?.body instanceof FormData;
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options?.headers,
      },
      ...options,
    });
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errData.detail || `HTTP error! status: ${res.status}`,
      };
    }
    
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error occurred',
    };
  }
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
    const res = await apiFetch<Lecture[]>('/lectures');
    if (res.success && res.data) {
      return {
        success: true,
        data: res.data,
        items: res.data,
        total: res.data.length,
        page,
        pageSize,
      };
    }
    return {
      success: false,
      items: [],
      total: 0,
      page,
      pageSize,
      error: res.error,
    };
  },

  async getById(id: string): Promise<ApiResponse<Lecture>> {
    return apiFetch<Lecture>(`/lectures/${id}`);
  },

  async create(formData: FormData): Promise<ApiResponse<Lecture>> {
    return apiFetch<Lecture>('/lectures', {
      method: 'POST',
      body: formData,
    });
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return apiFetch<null>(`/lectures/${id}`, {
      method: 'DELETE',
    });
  },
};

// ─── Transcripts API ──────────────────────────────────────────────────────────

export const transcriptsApi = {
  async getByLectureId(lectureId: string): Promise<ApiResponse<Transcript>> {
    return apiFetch<Transcript>(`/lectures/${lectureId}/transcript`);
  },
};

// ─── Notes API ────────────────────────────────────────────────────────────────

export const notesApi = {
  async getByLectureId(lectureId: string): Promise<ApiResponse<Note>> {
    return apiFetch<Note>(`/lectures/${lectureId}/notes`);
  },

  async regenerate(lectureId: string): Promise<ApiResponse<Note>> {
    return apiFetch<Note>(`/lectures/${lectureId}/notes/regenerate`, {
      method: 'POST',
    });
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
