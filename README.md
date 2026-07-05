# AI-Powered Portfolio Website

This project is a modern, AI-first personal portfolio website for Mehak Garg. It combines a polished frontend experience with an intelligent assistant that can answer questions about her background, skills, projects, research, and hiring fit.

## What this project includes

- A responsive single-page portfolio with sections for About, Skills, Projects, AI Suite, Recruiter Mode, and Contact
- A built-in AI-style chat assistant for portfolio conversations
- A recruiter-focused analysis experience that evaluates a job description against the profile
- A clean light/dark theme and animated UI experience
- A Python FastAPI backend that powers the assistant responses

## Project structure

- [index.html](index.html) — main portfolio page
- [styles.css](styles.css) — visual styling and responsive layout
- [script.js](script.js) — frontend interactivity, chat logic, recruiter analysis, and theme behavior
- [backend/app.py](backend/app.py) — FastAPI backend for the assistant API
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) — GitHub Pages deployment workflow
- [render.yaml](render.yaml) — optional Render deployment config for the backend

## Features

### Frontend
- Professional portfolio presentation
- Interactive AI assistant chat experience
- Project explainer cards
- Recruiter mode for job-description fit analysis
- Responsive navigation and theme toggle

### Backend
- FastAPI-based API
- Health endpoint at /health
- Chat endpoint at /api/chat
- Fallback responses when no OpenAI key is configured
- Optional OpenAI integration through OPENAI_API_KEY

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
The frontend is ready to be published through GitHub Pages using the workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

### Backend: Render or similar hosting
The backend is designed to be deployed separately from GitHub Pages. A sample Render configuration is included in [render.yaml](render.yaml).

## Environment variables

For AI-powered responses using OpenAI, set:

```bash
OPENAI_API_KEY=your_api_key_here
```

If this variable is not set, the backend uses built-in fallback responses.

## License

This project is for personal portfolio use and is not intended for resale or redistribution without permission.

