# 🎓 Unity-AI — Lecture Study Platform

> AI-powered lecture transcription, structured notes, and agentic tutor chatbot.

## Overview

Unity-AI transforms lecture recordings into interactive study sessions. Upload a lecture, get timestamped transcriptions, structured notes organized by topic, and an AI tutor that answers your questions with citations back to the source material.

### Core Pipeline

1. **Upload** — Audio/video lecture recording
2. **Transcription** — Speech-to-text with timestamps (Whisper API)
3. **Structured Notes** — LLM converts transcript into topic-organized notes, each linked to timestamps
4. **RAG Indexing** — Transcript chunks embedded into a vector store for retrieval
5. **Agentic Tutor** — AI chatbot that answers questions using transcript context, cites timestamps, jumps the player, and generates quizzes

## Project Structure

```
Unity-AI/
├── frontend/          # Next.js 16 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   └── public/
├── backend/           # FastAPI backend server (Python 3.10+)
├── docker-compose.yml # PostgreSQL for local dev (optional)
├── .env.example       # Environment variable template
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker (for PostgreSQL)

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

### Backend Development

```bash
cd backend
# Create virtual environment
python -m venv venv
# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the development server
python -m uvicorn app.main:app --reload --port 8000
```

The backend runs at `http://localhost:8000`.

### Environment Variables

Copy the example env file or create a `.env` in the `backend` folder:

```bash
# In backend/.env:
GROQ_API_KEY=your_groq_api_key
MONGO_URI=your_mongodb_connection_string
```

## Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Frontend   | Next.js 16, React 19, TypeScript  |
| Styling    | Tailwind CSS 4, Framer Motion     |
| Icons      | Lucide React                      |
| Backend    | FastAPI (Python)                  |
| Database   | MongoDB Atlas (with JSON fallback)|
| AI         | Groq Whisper API (Transcription), Groq LLaMA 3.3 (Notes & Chat) |
| RAG        | Text-based segment retrieval      |

## Team

- **Frontend** — UI/UX, Next.js pages, components, lecture viewer
- **Backend** — API, transcription pipeline, RAG, chatbot
- **Research** — Literature review, surveys, evaluation

## License

Private — NSU Hackathon Project
