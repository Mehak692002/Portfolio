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


class ChatRequest(BaseModel):
    message: str


PROFILE_KNOWLEDGE = """
Mehak Garg is a Computer Science professional focused on Python backend systems, REST APIs, AI/ML applications, and research-driven software engineering.
She is pursuing M.Tech in Computer Science and has a B.Tech in Computer Science background.
Her experience includes building Python backend services, data pipelines, and AI-powered features during internships.
She has worked on AI-powered recommendation systems, sleep pattern analysis, and healthcare-oriented ML projects.
Her technical skills include Python, SQL, C/C++, data structures, algorithms, OOP, REST APIs, system design, MySQL, Git, Jira, Bitbucket, Jupyter, Google Colab, Linux basics, Agile/Scrum, debugging, and code review.
She also has exposure to AI tools such as ChatGPT, Claude, Gemini, and similar AI assistants for productivity, coding support, research, and workflow acceleration, as well as LLM-based application development and CI/CD pipeline workflows.
Her published work includes a CRC Press publication on Solitude Assistance: An AI Powered Recommendation Platform, plus an IEEE review paper on cybersecurity in online banking.
Contact: rkgarg25@gmail.com | GitHub: https://github.com/Mehak692002
"""


def fallback_response(message: str) -> str:
    lower = message.lower()

    if any(term in lower for term in ["research", "publication", "paper"]):
        return "Mehak has worked on AI-powered recommendation systems and published research, with a strong focus on applied machine learning and practical software implementation."
    if any(term in lower for term in ["thesis", "sasa"]):
        return "Her work is centered on building intelligent and practical systems that use machine learning to solve real-world problems, with emphasis on architecture, feature engineering, and measurable outcomes."
    if any(term in lower for term in ["hire", "why should", "why hire"]):
        return "You should hire Mehak because she combines backend engineering, AI/ML thinking, and research experience with hands-on internship exposure."
    if any(term in lower for term in ["skill", "stack", "language", "python", "sql", "tool"]):
        return "Her skill set includes Python, SQL, REST APIs, MySQL, data pipelines, scikit-learn, TensorFlow, Git, system design, LLM-based workflows, CI/CD pipelines, and AI tools such as ChatGPT, Claude, and Gemini."
    if any(term in lower for term in ["project", "sleep", "solitude", "backend"]):
        return "Her notable projects include Solitude Selections, a recommendation platform, and Sleep Pattern Analysis, a healthcare-focused machine learning system."
    if any(term in lower for term in ["experience", "intern"]):
        return "She has worked as a Software Developer Intern and built production-oriented backend services and AI-powered systems in Agile teams."
    return f"Here is a concise profile summary: {PROFILE_KNOWLEDGE}"


def llm_response(message: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or OpenAI is None:
        return fallback_response(message)

    client = OpenAI(api_key=api_key)
    completion = client.responses.create(
        model="gpt-4o-mini",
        instructions=(
            "You are Mehak Garg's AI portfolio assistant. Answer questions about her background, skills, projects, research, and fit for roles. "
            "Be concise, professional, and accurate. Use the following profile context: " + PROFILE_KNOWLEDGE
        ),
        input=message,
    )
    return completion.output_text.strip()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/chat")
def chat(request: ChatRequest):
    try:
        answer = llm_response(request.message)
    except Exception:
        answer = fallback_response(request.message)
    return {"reply": answer}
