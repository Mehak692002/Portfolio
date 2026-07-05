const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const year = document.getElementById("year");
const voiceBtn = document.getElementById("voice-btn");
const promptChips = document.querySelectorAll(".prompt-chip");
const projectButtons = document.querySelectorAll(".project-action");
const explainerOutput = document.getElementById("explainer-output");
const analyzeBtn = document.getElementById("analyze-btn");
const jobDescription = document.getElementById("job-description");
const analysisResult = document.getElementById("analysis-result");
const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");
const themeToggle = document.getElementById("theme-toggle");

const backendBaseUrl = (window.__PORTFOLIO_BACKEND_URL__ || "").trim() || (
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8001"
    : "https://your-backend-url.onrender.com"
);
const chatEndpoint = `${backendBaseUrl.replace(/\/$/, "")}/api/chat`;

if (year) {
  year.textContent = new Date().getFullYear();
}

const knowledgeBase = {
  intro:
    "Mehak Garg is a Computer Science professional focused on Python backend systems, AI/ML applications, and research-driven product development.",
  research:
    "Her research work centers on AI-powered recommendation systems and machine learning for practical healthcare and personalization use cases. She is especially interested in building systems that combine smart algorithms with real-world data workflows.",
  thesis:
    "Her work can be framed as building intelligent, practical systems that use machine learning to solve real-world problems, with a strong emphasis on feature engineering, reusable architecture, and measurable outcomes.",
  hire:
    "You should hire Mehak because she combines backend engineering, AI/ML thinking, and research experience with hands-on internship exposure, making her a strong fit for impactful engineering roles.",
  skills:
    "Her skills include Python, SQL, REST APIs, MySQL, data pipelines, scikit-learn, TensorFlow, Git, system design, OOP, Agile software development, LLM-based workflows, CI/CD pipelines, and practical exposure to ChatGPT, Claude, Gemini, and other AI assistants for research, coding support, and productivity.",
  projects: {
    solitude: {
      simple: "Solitude Selections is an AI-powered recommendation platform that personalizes content using machine learning and thoughtful data preprocessing.",
      technical: "This project combines feature engineering, recommendation pipelines, reusable Python components, and modular architecture to build a scalable recommendation system."
    },
    sleep: {
      simple: "Sleep Pattern Analysis uses machine learning to study lifestyle and sleep data and generate practical recommendations for better wellbeing.",
      technical: "This project applies supervised learning to a structured health dataset with preprocessing, feature engineering, and performance evaluation to uncover patterns in sleep behavior."
    },
    backend: {
      simple: "Her backend work focuses on reliable Python services, API development, data workflows, and performance-oriented engineering practices.",
      technical: "She has built and optimized backend services with REST APIs, SQL-driven data pipelines, and reliability-focused engineering practices in production-oriented environments."
    }
  },
  experience:
    "She has worked as a Software Developer Intern, building Python backend services and contributing to AI-powered products in an Agile environment."
};

function addBubble(text, sender = "bot") {
  if (!chatWindow) {
    return;
  }

  const bubble = document.createElement("div");
  bubble.className = `bubble ${sender}`;
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function getResponse(input) {
  const message = input.trim();

  if (!message) {
    return "Please ask about my research, projects, skills, or experience.";
  }

  try {
    const response = await fetch(chatEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error("Backend unavailable");
    }

    const data = await response.json();
    return data.reply || "I’m here to help with your questions about Mehak’s background.";
  } catch (error) {
    const lower = message.toLowerCase();

    if (lower.includes("research") || lower.includes("paper") || lower.includes("publication")) {
      return knowledgeBase.research;
    }
    if (lower.includes("thesis") || lower.includes("sasa")) {
      return knowledgeBase.thesis;
    }
    if (lower.includes("hire") || lower.includes("should i hire") || lower.includes("why hire")) {
      return knowledgeBase.hire;
    }
    if (lower.includes("skill") || lower.includes("stack") || lower.includes("language") || lower.includes("python") || lower.includes("sql") || lower.includes("tool")) {
      return knowledgeBase.skills;
    }
    if (lower.includes("project") || lower.includes("sleep") || lower.includes("solitude") || lower.includes("backend")) {
      if (lower.includes("sleep")) {
        return knowledgeBase.projects.sleep.simple;
      }
      if (lower.includes("solitude")) {
        return knowledgeBase.projects.solitude.simple;
      }
      return knowledgeBase.projects.backend.simple;
    }
    if (lower.includes("experience") || lower.includes("intern")) {
      return knowledgeBase.experience;
    }

    return `${knowledgeBase.intro} Ask about her research, projects, skills, or experience.`;
  }
}

function initializeChat() {
  addBubble("Welcome! I’m Mehak’s AI portfolio guide. Ask me about her research, projects, skills, or why she would be a strong hire.");
}

if (chatForm) {
  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = chatInput.value.trim();

    if (!value) {
      return;
    }

    addBubble(value, "user");
    chatInput.value = "";

    addBubble("Thinking...");

    const reply = await getResponse(value);
    const thinkingMessages = Array.from(chatWindow.querySelectorAll('.bubble'));
    const lastThinking = thinkingMessages[thinkingMessages.length - 1];
    if (lastThinking && lastThinking.textContent === "Thinking...") {
      lastThinking.remove();
    }

    addBubble(reply);
  });
}

promptChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    if (chatInput) {
      chatInput.value = chip.dataset.prompt || "";
      if (chatForm) {
        chatForm.requestSubmit();
      }
    }
  });
});

projectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const project = button.dataset.project;
    const mode = button.dataset.mode;
    const summary = knowledgeBase.projects[project]?.[mode] || "Select a project to see an AI-style explanation.";
    if (explainerOutput) {
      explainerOutput.textContent = summary;
    }
  });
});

if (analyzeBtn && jobDescription && analysisResult) {
  analyzeBtn.addEventListener("click", () => {
    const text = jobDescription.value.toLowerCase();
    const strengths = [];
    const gaps = [];

    if (text.includes("python") || text.includes("backend")) {
      strengths.push("Python backend engineering");
    }
    if (text.includes("machine learning") || text.includes("ml") || text.includes("ai")) {
      strengths.push("AI/ML and data-driven product work");
    }
    if (text.includes("api") || text.includes("rest")) {
      strengths.push("REST API and service development");
    }
    if (text.includes("research") || text.includes("publication")) {
      strengths.push("Research-oriented problem solving");
    }
    if (text.includes("docker") || text.includes("aws") || text.includes("kubernetes")) {
      gaps.push("Cloud and container deployment experience");
    }
    if (text.includes("llm") || text.includes("prompt") || text.includes("fine-tuning")) {
      gaps.push("Advanced LLM-specific production experience");
    }

    if (strengths.length === 0) {
      strengths.push("Strong foundation in Python, AI/ML, and backend development");
    }
    if (gaps.length === 0) {
      gaps.push("Broaden deployment and production-scale tooling exposure");
    }

    const score = Math.min(93, 65 + strengths.length * 7 - gaps.length * 3);

    analysisResult.innerHTML = `
      <h3>Recruiter insight</h3>
      <p><strong>Match score:</strong> ${score}%</p>
      <p><strong>Strong fit:</strong></p>
      <ul>${strengths.map((item) => `<li>${item}</li>`).join("")}</ul>
      <p><strong>Potential gaps:</strong></p>
      <ul>${gaps.map((item) => `<li>${item}</li>`).join("")}</ul>
    `;
  });
}

if (voiceBtn) {
  voiceBtn.addEventListener("click", () => {
    if (window.speechSynthesis) {
      const greeting = new SpeechSynthesisUtterance("Hello. I am Mehak's AI portfolio guide. Ask me about her research, projects, or hiring fit.");
      greeting.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(greeting);
    }
  });
}

if (themeToggle) {
  const storedTheme = localStorage.getItem("mehak-theme");
  if (storedTheme === "light") {
    document.body.classList.add("light-theme");
    themeToggle.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    themeToggle.textContent = isLight ? "☀️" : "🌙";
    localStorage.setItem("mehak-theme", isLight ? "light" : "dark");
  });
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const introOverlay = document.getElementById("intro-overlay");

if (introOverlay) {
  setTimeout(() => {
    introOverlay.classList.add("hidden");
  }, 2200);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

initializeChat();
