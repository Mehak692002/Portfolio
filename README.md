# AI-Powered Portfolio Website

This project is a modern, AI-first personal portfolio website for Mehak Garg, a Python Software Engineer
focused on computer-vision microservices, event-driven messaging systems, and AI/ML applications. It combines
a polished frontend experience with an intelligent, context-aware assistant that can answer questions about
her background, skills, projects, research, and hiring fit.

## What this project includes

- A responsive single-page portfolio with sections for About, Experience, Skills, Projects, AI Suite,
  Recruiter Mode, and Contact
- A context-aware AI chat assistant that remembers the conversation, gives varied answers, and suggests
  relevant follow-up questions after each reply
- A recruiter-focused analysis experience that evaluates a job description against the profile
- A clean light/dark theme and animated UI experience
- A Python FastAPI backend that powers the assistant responses, with optional real multi-turn LLM conversation
  support

## Project structure

- [index.html](index.html) — main portfolio page
- [styles.css](styles.css) — visual styling and responsive layout
- [script.js](script.js) — frontend interactivity, chat logic, recruiter analysis, and theme behavior
- [backend/app.py](backend/app.py) — FastAPI backend for the assistant API
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) — GitHub Pages deployment workflow
- [render.yaml](render.yaml) — optional Render deployment config for the backend

## Features

### Frontend

- Professional portfolio presentation covering both internships (Veya Technologies, McDermott) and all
  current projects (Face Recognition System, NATS messaging library, Jira analytics automation, Sleep Pattern
  Analysis, Solitude Selections)
- An AI assistant that:
  - Tracks conversation history so follow-ups like "tell me more" expand on the last topic instead of
    resetting
  - Scores messages against multiple keyword-weighted topics rather than matching the first keyword it sees
  - Shows a realistic typing indicator before responding
  - Offers dynamic, topic-relevant follow-up suggestion chips after every answer
  - Varies its phrasing across repeated questions so it doesn't feel scripted
  - Sends full conversation history to the backend, so when an OpenAI key is configured the assistant holds a
    genuine multi-turn conversation instead of answering each message in isolation
- Project explainer cards (30-second and technical-depth modes) for every project
- Recruiter mode for job-description fit analysis, including computer vision and event-driven messaging
  keyword matching
- Responsive navigation and theme toggle

### Backend

- FastAPI-based API
- Health endpoint at `/health`
- Chat endpoint at `/api/chat`, accepting an optional `history` array for multi-turn context
- Rich, topic-specific fallback responses when no OpenAI key is configured
- Optional OpenAI integration through `OPENAI_API_KEY`, with conversation history passed through for real
  context-aware answers

## Run locally

### Frontend

You can open [index.html](index.html) directly in a browser, or serve the project with a simple static server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000/
```

### Backend

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Run the backend locally:

```bash
cd backend
uvicorn app:app --reload --host 127.0.0.1 --port 8001
```

The backend will be available at:

```text
http://127.0.0.1:8001/health
```

## Deployment

### Frontend: GitHub Pages

The frontend is ready to be published through GitHub Pages using the workflow in
[.github/workflows/deploy.yml](.github/workflows/deploy.yml).

### Backend: Render or similar hosting

The backend is designed to be deployed separately from GitHub Pages. A sample Render configuration is included
in [render.yaml](render.yaml).

## Environment variables

For AI-powered responses using OpenAI, set:

```bash
OPENAI_API_KEY=your_api_key_here
```

If this variable is not set, the backend uses built-in, topic-aware fallback responses.

## License

This project is for personal portfolio use and is not intended for resale or redistribution without
permission.