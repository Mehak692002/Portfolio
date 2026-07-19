from typing import List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

try:
    from openai import OpenAI
except Exception:  # pragma: no cover
    OpenAI = None

app = FastAPI(title="Mehak Portfolio Assistant")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None


PROFILE_KNOWLEDGE = """
Mehak Garg is a Python Software Engineer focused on computer-vision microservices, event-driven messaging
systems, and AI/ML applications.

Current role: Software Developer Intern at Veya Technologies (Jan 2026 - Present). She builds components of a
Python-based Face Recognition System (FRS) using MediaPipe and ONNX, including face processing and
spoof-detection, plus a motion-detection pipeline. She applies threading and concurrent-processing concepts to
keep computer-vision workflows efficient. She built a reusable Python library for NATS/NATS JetStream
messaging, covering publisher and subscriber workflows, stream and consumer management, message
acknowledgements, and retry mechanisms. She also automated Jira-based engineering report generation using
Python APIs and Jenkins, and introduced Defect Quality, Scrum Quality, Review Activity, and Sprint Activity
tracking. She works in a Linux environment with Git, Bitbucket, Jira, and Agile/Scrum.

Earlier role: Software Developer Intern at McDermott (Jul 2022 - Aug 2022), where she built Python
data-processing pipelines for structured datasets, wrote and optimized SQL queries, implemented validation and
error-handling, and documented workflows.

Projects: Sleep Pattern Analysis & Lifestyle Recommendation System (Python, Pandas, NumPy, Scikit-learn,
TensorFlow/Keras, deployed via Vercel, Neon, and Render) and Solitude Selections, an AI-powered recommendation
platform with modular, object-oriented Python pipelines, published as a research contribution in CRC Press,
Taylor & Francis Group, 2025.

Technical skills: Python, SQL, C/C++ basics, microservices, REST APIs, OOP, data structures & algorithms,
threading, MediaPipe, ONNX, spoof detection, scikit-learn, TensorFlow/Keras, feature engineering, NATS, NATS
JetStream, pub/sub, MySQL, PostgreSQL, Git, Bitbucket, Jira, Jenkins, Docker, Linux, Agile/Scrum, and technical
documentation.

Education: M.Tech in Computer Science & Engineering at J.C. Bose University of Science & Technology (CGPA
8.64, 2024-2026), and B.Tech in Computer Science & Engineering at Manav Rachna International Institute of
Research and Studies (CGPA 8.08, 2020-2024).

Publications: "Solitude Assistance: An AI Powered Recommendation Platform" (CRC Press, Taylor & Francis Group,
2025) and "Global Case Studies, Domains and Used Methodologies Concerning Cyber Security in Online Banking: A
Review" (IEEE, 2022).

Certifications: Google Data Analytics Professional Certificate, IBM Deep Learning with TensorFlow, IBM
Generative AI Fundamentals, IBM Introduction to Cloud Computing.

Contact: rkgarg25@gmail.com | GitHub: https://github.com/Mehak692002
"""


def fallback_response(message: str) -> str:
    lower = message.lower()
    if any(term in lower for term in ["frs", "face recognition", "spoof", "motion detection", "mediapipe", "onnx", "computer vision"]):
        return (
            "She's building components of a Python-based Face Recognition System using MediaPipe and ONNX, "
            "including spoof detection, plus a motion-detection pipeline, applying threading and "
            "concurrent-processing concepts to keep the pipeline efficient."
        )
    if any(term in lower for term in ["nats", "jetstream", "messaging", "event-driven", "event driven", "pub/sub", "pubsub"]):
        return (
            "She built a reusable Python library for NATS and NATS JetStream messaging, covering publisher and "
            "subscriber workflows, stream and consumer management, message acknowledgements, and retry mechanisms."
        )
    if any(term in lower for term in ["research", "publication", "paper", "ieee"]):
        return (
            "She has two publications: an AI-powered recommendation platform paper in CRC Press, Taylor & "
            "Francis Group (2025), and an IEEE review paper on cybersecurity in online banking (2022)."
        )
    if any(term in lower for term in ["hire", "why should", "why hire"]):
        return (
            "You should hire Mehak because she combines production computer-vision and messaging-systems "
            "engineering with AI/ML research experience, and she's currently shipping this work as a Software "
            "Developer Intern."
        )
    if any(term in lower for term in ["skill", "stack", "language", "python", "sql", "tool"]):
        return (
            "Her skill set includes Python, SQL, microservices, REST APIs, MediaPipe, ONNX, NATS/NATS "
            "JetStream, scikit-learn, TensorFlow, Git, Jenkins, Docker, and Agile/Scrum practices."
        )
    if any(term in lower for term in ["project", "sleep", "solitude", "jira automation"]):
        return (
            "Her notable projects include a Face Recognition System, a NATS messaging library, Jira "
            "engineering analytics automation, Solitude Selections, and Sleep Pattern Analysis."
        )
    if any(term in lower for term in ["experience", "intern", "veya", "mcdermott"]):
        return (
            "She's currently a Software Developer Intern at Veya Technologies working on computer vision and "
            "messaging systems, and previously interned at McDermott building Python data-processing pipelines."
        )
    return f"Here is a concise profile summary: {PROFILE_KNOWLEDGE}"


def llm_response(message: str, history: Optional[List[ChatMessage]]) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or OpenAI is None:
        return fallback_response(message)

    client = OpenAI(api_key=api_key)

    # Build a real multi-turn conversation so the assistant can handle
    # follow-ups like "tell me more" or "what about the other one" instead
    # of treating every message in isolation.
    input_messages = []
    for turn in history or []:
        role = "user" if turn.role == "user" else "assistant"
        input_messages.append({"role": role, "content": turn.content})
    input_messages.append({"role": "user", "content": message})

    completion = client.responses.create(
        model="gpt-4o-mini",
        instructions=(
            "You are Mehak Garg's AI portfolio assistant. Answer questions about her background, skills, "
            "projects, research, and fit for roles, using the conversation history for context on follow-up "
            "questions. Be concise, professional, and accurate. Use the following profile context: "
            + PROFILE_KNOWLEDGE
        ),
        input=input_messages,
    )
    return completion.output_text.strip()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/chat")
def chat(request: ChatRequest):
    try:
        answer = llm_response(request.message, request.history)
    except Exception:
        answer = fallback_response(request.message)
    return {"reply": answer}