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

/* ---------------------------------------------------------------------
 * Conversation state
 * -------------------------------------------------------------------*/
// Full turn history sent to the backend so a real LLM (when configured)
// can hold an actual multi-turn conversation instead of answering each
// message in isolation.
let conversationHistory = [];
// Last topic discussed, used so "tell me more" / "go deeper" style
// follow-ups can expand on what was just said instead of resetting.
let lastTopic = null;

/* ---------------------------------------------------------------------
 * Knowledge base: topics, keyword triggers, varied phrasings, and the
 * follow-up suggestions to surface after each topic.
 * -------------------------------------------------------------------*/
const topics = {
  greeting: {
    keywords: ["hi", "hello", "hey", "yo", "greetings"],
    replies: [
      "Hey! I'm Mehak's AI portfolio guide. Ask me about her experience, projects, skills, or why she'd be a strong hire.",
      "Hello! Happy to walk you through Mehak's work — try asking about the Face Recognition System or her NATS messaging library."
    ],
    detail: "I can go deeper on internships, specific projects, tech stack, research, or availability — just ask.",
    suggestions: ["Why hire Mehak?", "Tell me about her experience", "What's she working on right now?"]
  },
  hire: {
    keywords: ["hire", "why should", "why hire", "strong fit", "good candidate", "worth hiring"],
    replies: [
      "You should hire Mehak because she pairs production backend engineering with real computer-vision and event-driven systems experience — she's currently shipping FRS and messaging components, not just studying them.",
      "Strong reasons to hire her: hands-on Python microservice work on a live Face Recognition System, a reusable NATS JetStream messaging library she built from scratch, and a research background that shows she can go deep when needed."
    ],
    detail: "She's also comfortable owning ambiguity — she introduced her own quality-tracking sheets at Veya Technologies rather than waiting to be asked.",
    suggestions: ["What are her core skills?", "Tell me about the FRS project", "Any research publications?"]
  },
  experience: {
    keywords: ["experience", "intern", "internship", "veya", "mcdermott", "work history", "job"],
    replies: [
      "She's currently a Software Developer Intern at Veya Technologies (Jan 2026–present), building a Python-based Face Recognition System and motion-detection pipeline with MediaPipe and ONNX, plus a reusable NATS JetStream messaging library.",
      "Her experience spans two internships: Veya Technologies, where she works on computer-vision microservices and messaging infrastructure, and McDermott, where she built Python data-processing pipelines and optimized SQL queries."
    ],
    detail: "At Veya she also automated Jira-based engineering reporting with Python and Jenkins, adding Defect Quality, Scrum Quality, Review Activity, and Sprint Activity tracking that didn't exist before.",
    suggestions: ["Tell me about the FRS project", "What's the NATS messaging library?", "What did she do at McDermott?"]
  },
  frs: {
    keywords: ["frs", "face recognition", "spoof", "motion detection", "computer vision", "mediapipe", "onnx"],
    replies: [
      "She's building components of a Python-based Face Recognition System (FRS) using MediaPipe and ONNX — covering face processing and spoof-detection — alongside a separate motion-detection pipeline.",
      "The FRS work involves real-time computer-vision processing: face detection and spoof-detection with MediaPipe and ONNX, with threading and concurrent-processing techniques applied to keep the pipeline efficient."
    ],
    detail: "Technically, this means balancing model inference latency against throughput — she applies threading and concurrent-processing patterns so the vision pipeline doesn't block on a single frame.",
    suggestions: ["What's the NATS messaging library?", "What ML tools does she use?", "Show me her other projects"]
  },
  nats: {
    keywords: ["nats", "jetstream", "messaging", "event-driven", "event driven", "pub/sub", "pubsub", "kafka", "rabbitmq", "queue"],
    replies: [
      "She built a reusable Python library for NATS and NATS JetStream messaging — covering publisher and subscriber workflows, stream and consumer management, message acknowledgements, and retry mechanisms.",
      "Her messaging work is event-driven end to end: NATS JetStream streams and consumers, explicit acknowledgements, and retry handling so downstream services stay resilient when something fails."
    ],
    detail: "It's built to be reused across services, so other teams don't have to re-implement pub/sub plumbing — just import the library and wire up their handlers.",
    suggestions: ["Tell me about the FRS project", "What backend tools does she use?", "Why should I hire her?"]
  },
  jira: {
    keywords: ["jira automation", "jenkins", "reporting", "sprint activity", "scrum quality", "defect quality", "review activity"],
    replies: [
      "She automated Jira-based engineering report generation using Python APIs and Jenkins, giving the team visibility into delivery and defect quality that they didn't have before.",
      "This project introduced structured Defect Quality and Scrum Quality tracking sheets, plus Review Activity and Sprint Activity tracking, all generated automatically via Python and Jenkins."
    ],
    detail: "It's a good example of her taking initiative — the tracking structure wasn't handed to her; she designed it based on what the engineering team actually needed to see.",
    suggestions: ["What's the NATS messaging library?", "Tell me about her internships", "What are her core skills?"]
  },
  sleep: {
    keywords: ["sleep", "lifestyle recommendation"],
    replies: [
      "Sleep Pattern Analysis is a healthcare-focused ML application: Python-based preprocessing and feature engineering feed a classification pipeline that turns sleep data into personalized lifestyle recommendations.",
      "This project takes raw sleep data through preprocessing and feature engineering, runs it through a scikit-learn/TensorFlow classification pipeline, and surfaces the predictions as actionable recommendations in a deployed app."
    ],
    detail: "It's deployed with Vercel, Neon, and Render, so it's a full slice of the stack — not just a notebook experiment.",
    suggestions: ["Tell me about Solitude Selections", "What ML tools does she use?", "Show me her other projects"]
  },
  solitude: {
    keywords: ["solitude", "recommendation platform", "crc press"],
    replies: [
      "Solitude Selections is an end-to-end AI-powered recommendation platform — data ingestion, preprocessing, feature engineering, and recommendation logic, built with reusable, object-oriented Python modules.",
      "This one's also published research: 'Solitude Assistance: An AI Powered Recommendation Platform' appeared in CRC Press, Taylor & Francis Group, 2025."
    ],
    detail: "The architecture is deliberately modular, so the recommendation logic and models can be swapped or extended without touching the core data-processing pipeline.",
    suggestions: ["Tell me about her research publications", "What's the Sleep Pattern Analysis project?", "What are her core skills?"]
  },
  skills: {
    keywords: ["skill", "stack", "language", "python", "sql", "tool", "tech stack", "technologies"],
    replies: [
      "Her core stack is Python, SQL, and C/C++ basics, with REST APIs, microservices, and OOP for backend work; MediaPipe, ONNX, scikit-learn, and TensorFlow/Keras for AI and computer vision; and NATS/NATS JetStream for event-driven messaging.",
      "Day to day she works across Python, MySQL/PostgreSQL, Git, Bitbucket, Jira, and Jenkins, plus Docker, Linux, and Agile/Scrum practices — with computer vision and messaging systems as her current specialization."
    ],
    detail: "She's also comfortable with data structures & algorithms and threading/concurrency, which shows up directly in how she's built the FRS and motion-detection pipelines.",
    suggestions: ["Tell me about the FRS project", "What's the NATS messaging library?", "Any research publications?"]
  },
  research: {
    keywords: ["research", "publication", "paper", "ieee", "thesis", "sasa"],
    replies: [
      "She has two publications: 'Solitude Assistance: An AI Powered Recommendation Platform' in CRC Press, Taylor & Francis Group (2025), and an IEEE review paper on cybersecurity in online banking (2022).",
      "Her research background pairs with her engineering work — the recommendation-platform paper grew directly out of the Solitude Selections project she built and shipped."
    ],
    detail: "She's finishing her M.Tech in Computer Science & Engineering at J.C. Bose University of Science & Technology with a CGPA of 8.64.",
    suggestions: ["Tell me about Solitude Selections", "What's her education background?", "What certifications does she have?"]
  },
  education: {
    keywords: ["education", "degree", "university", "college", "cgpa", "m.tech", "b.tech", "certification", "certificate"],
    replies: [
      "She's completing her M.Tech in Computer Science & Engineering at J.C. Bose University of Science & Technology (CGPA 8.64), after a B.Tech in Computer Science & Engineering from Manav Rachna International Institute of Research and Studies (CGPA 8.08).",
      "Alongside her degrees, she holds the Google Data Analytics Professional Certificate and three IBM certifications: Deep Learning with TensorFlow, Generative AI Fundamentals, and Introduction to Cloud Computing."
    ],
    detail: "That mix of formal CS education and applied certifications is part of why she moves comfortably between research and production engineering.",
    suggestions: ["Any research publications?", "What are her core skills?", "Why should I hire her?"]
  },
  contact: {
    keywords: ["contact", "email", "reach", "phone", "linkedin", "github", "hire her", "availability", "available"],
    replies: [
      "Best way to reach her is by email at rkgarg25@gmail.com, or check out her code on GitHub at github.com/Mehak692002.",
      "You can email her directly at rkgarg25@gmail.com — she's currently interning at Veya Technologies and open to new opportunities as she wraps up her M.Tech."
    ],
    detail: null,
    suggestions: ["Why should I hire her?", "What's she working on right now?", "Show me her projects"]
  }
};

const followUpKeywords = ["more", "go deeper", "explain further", "tell me more", "details", "elaborate", "expand"];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function scoreTopics(message) {
  const lower = message.toLowerCase();
  const scores = [];
  for (const [key, topic] of Object.entries(topics)) {
    let score = 0;
    topic.keywords.forEach((keyword) => {
      if (lower.includes(keyword)) {
        score += keyword.split(" ").length; // reward multi-word / specific matches
      }
    });
    if (score > 0) {
      scores.push({ key, score });
    }
  }
  scores.sort((a, b) => b.score - a.score);
  return scores;
}

function isFollowUp(message) {
  const lower = message.toLowerCase();
  return followUpKeywords.some((keyword) => lower.includes(keyword));
}

function fallbackAnswer(message) {
  const lower = message.trim().toLowerCase();
  if (!lower) {
    return { reply: "Ask me about Mehak's experience, projects, skills, or research — whatever's most useful to you.", suggestions: ["Why hire Mehak?", "Tell me about her experience", "What are her core skills?"] };
  }

  if (isFollowUp(message) && lastTopic && topics[lastTopic]) {
    const topic = topics[lastTopic];
    return {
      reply: topic.detail || pickRandom(topic.replies),
      suggestions: topic.suggestions
    };
  }

  const ranked = scoreTopics(message);
  if (ranked.length > 0) {
    const key = ranked[0].key;
    lastTopic = key;
    const topic = topics[key];
    return { reply: pickRandom(topic.replies), suggestions: topic.suggestions };
  }

  lastTopic = null;
  return {
    reply: "I don't have a specific answer for that yet, but I can tell you about Mehak's experience at Veya Technologies and McDermott, her computer-vision and messaging projects, her skills, or her research — what sounds useful?",
    suggestions: ["Tell me about her experience", "Show me her projects", "What are her core skills?"]
  };
}

function addBubble(text, sender = "bot") {
  if (!chatWindow) {
    return null;
  }
  const bubble = document.createElement("div");
  bubble.className = `bubble ${sender}`;
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return bubble;
}

function addTypingBubble() {
  if (!chatWindow) {
    return null;
  }
  const bubble = document.createElement("div");
  bubble.className = "bubble typing";
  bubble.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return bubble;
}

function renderSuggestions(suggestions) {
  const existing = document.getElementById("dynamic-suggestions");
  if (existing) {
    existing.remove();
  }
  if (!suggestions || suggestions.length === 0 || !chatWindow) {
    return;
  }
  const row = document.createElement("div");
  row.className = "suggestion-row";
  row.id = "dynamic-suggestions";
  suggestions.forEach((text) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "suggestion-chip";
    chip.textContent = text;
    chip.addEventListener("click", () => {
      if (chatInput) {
        chatInput.value = text;
        chatForm.requestSubmit();
      }
    });
    row.appendChild(chip);
  });
  chatWindow.parentElement.insertBefore(row, chatWindow.nextSibling);
}

async function getResponse(message) {
  const trimmed = message.trim();
  if (!trimmed) {
    return { reply: "Please ask about my research, projects, skills, or experience.", suggestions: [] };
  }

  try {
    const response = await fetch(chatEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: trimmed, history: conversationHistory })
    });
    if (!response.ok) {
      throw new Error("Backend unavailable");
    }
    const data = await response.json();
    if (data.reply) {
      return { reply: data.reply, suggestions: data.suggestions || fallbackAnswer(trimmed).suggestions };
    }
    throw new Error("Empty backend reply");
  } catch (error) {
    return fallbackAnswer(trimmed);
  }
}

function initializeChat() {
  addBubble("Welcome! I'm Mehak's AI portfolio guide. Ask me about her experience, projects, skills, or why she'd be a strong hire — and I'll remember what we've talked about as we go.");
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
    const dynamicSuggestions = document.getElementById("dynamic-suggestions");
    if (dynamicSuggestions) {
      dynamicSuggestions.remove();
    }
    const staticPromptRow = document.getElementById("prompt-row");
    if (staticPromptRow) {
      staticPromptRow.style.display = "none";
    }

    const typingBubble = addTypingBubble();
    const typingDelay = 450 + Math.random() * 500;
    const [result] = await Promise.all([
      getResponse(value),
      new Promise((resolve) => setTimeout(resolve, typingDelay))
    ]);

    if (typingBubble) {
      typingBubble.remove();
    }
    addBubble(result.reply);
    renderSuggestions(result.suggestions);

    conversationHistory.push({ role: "user", content: value });
    conversationHistory.push({ role: "assistant", content: result.reply });
    if (conversationHistory.length > 12) {
      conversationHistory = conversationHistory.slice(-12);
    }
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

const projectExplainerCopy = {
  frs: {
    simple: "The FRS project is a Python computer-vision microservice that recognizes faces and checks they're real (not a photo or video) using MediaPipe and ONNX.",
    technical: "Built as Python microservice components for a Face Recognition System, this project uses MediaPipe and ONNX for face processing and spoof-detection, with threading and concurrent-processing patterns applied so inference doesn't bottleneck the pipeline. A related motion-detection pipeline shares the same computer-vision foundation."
  },
  nats: {
    simple: "A reusable Python library that lets services send and receive messages reliably using NATS JetStream, so teams don't have to build that plumbing themselves.",
    technical: "This library implements NATS/NATS JetStream publisher and subscriber workflows, including stream and consumer management, message acknowledgements, and retry mechanisms — designed to be imported across services for consistent event-driven messaging."
  },
  jira: {
    simple: "An automated reporting tool that pulls Jira data and turns it into quality and activity tracking sheets, so the engineering team can see how delivery is going at a glance.",
    technical: "Uses Python APIs and Jenkins to automate Jira-based engineering report generation, introducing structured Defect Quality and Scrum Quality tracking sheets alongside Review Activity and Sprint Activity tracking modules."
  },
  sleep: {
    simple: "Sleep Pattern Analysis is an AI-powered recommendation platform that personalizes content using machine learning and thoughtful data preprocessing.",
    technical: "This project applies supervised learning to a structured health dataset with preprocessing, feature engineering, and performance evaluation to uncover patterns in sleep behavior, deployed via Vercel, Neon, and Render.",
    Project_Link : "https://sleep-recommendation-system.vercel.app/"

  },
  solitude: {
    simple: "Solitude Selections is an AI-powered recommendation platform that personalizes recommendations using data preprocessing, feature engineering, and modular machine learning pipelines.",
    technical: "This project combines feature engineering, recommendation pipelines, and reusable, object-oriented Python modules to build a scalable recommendation system — published as a CRC Press research contribution in 2025."
  }
};

projectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const project = button.dataset.project;
    const mode = button.dataset.mode;
    const summary = projectExplainerCopy[project]?.[mode] || "Select a project to see an AI-style explanation.";
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
    if (text.includes("computer vision") || text.includes("opencv") || text.includes("mediapipe") || text.includes("image processing")) {
      strengths.push("Computer vision (MediaPipe, ONNX, spoof detection)");
    }
    if (text.includes("microservice") || text.includes("api") || text.includes("rest")) {
      strengths.push("Microservices and REST API development");
    }
    if (text.includes("kafka") || text.includes("nats") || text.includes("rabbitmq") || text.includes("event-driven") || text.includes("messaging") || text.includes("pub/sub") || text.includes("pubsub")) {
      strengths.push("Event-driven messaging systems (NATS/JetStream)");
    }
    if (text.includes("machine learning") || text.includes(" ml") || text.includes("ai ")) {
      strengths.push("AI/ML and data-driven product work");
    }
    if (text.includes("research") || text.includes("publication")) {
      strengths.push("Research-oriented problem solving");
    }
    if (text.includes("docker") || text.includes("ci/cd") || text.includes("jenkins")) {
      strengths.push("CI/CD and containerized workflows (Docker, Jenkins)");
    }

    if (text.includes("kubernetes") || text.includes("aws") || text.includes("cloud infrastructure") || text.includes("terraform")) {
      gaps.push("Large-scale cloud infrastructure (Kubernetes/Terraform) experience");
    }
    if (text.includes("go") && text.includes("golang")) {
      gaps.push("Go/Golang production experience");
    }
    if (text.includes("llm") || text.includes("prompt engineering") || text.includes("fine-tuning")) {
      gaps.push("Advanced LLM-specific production experience");
    }

    if (strengths.length === 0) {
      strengths.push("Strong foundation in Python, computer vision, and backend systems");
    }
    if (gaps.length === 0) {
      gaps.push("Broaden large-scale cloud deployment exposure");
    }

    const score = Math.min(95, 62 + strengths.length * 6 - gaps.length * 3);
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
      const greeting = new SpeechSynthesisUtterance("Hello. I am Mehak's AI portfolio guide. Ask me about her experience, projects, or hiring fit.");
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