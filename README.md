<div align="center">

# 🧠 AI Knowledge Quiz Builder

### An intelligent quiz generation platform powered by LLaMA 3.3 70B and Spring Boot

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Groq](https://img.shields.io/badge/LLaMA_3.3_70B-Groq-F55036?style=flat-square&logo=groq)](https://groq.com/)
[![Model](https://img.shields.io/badge/Model-llama--3.3--70b--versatile-blueviolet?style=flat-square)](https://console.groq.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [AI Design Decisions](#-ai-design-decisions)
- [Unique Feature — Adaptive Difficulty Engine](#-unique-feature--adaptive-difficulty-engine)
- [Running Tests](#-running-tests)
- [Deployment](#-deployment)

---

## 📌 Overview

**AI Knowledge Quiz Builder** is a full-stack web application that automatically generates multiple-choice quizzes on any topic using large language models. A user enters a topic (e.g., *"Photosynthesis"*, *"Neural Networks"*, *"Ancient Rome"*) and receives a structured 5-question quiz with four options each, instant scoring, per-question explanations, and a personalized difficulty recommendation for their next attempt.

The project was built as a technical assignment with a focus on **clean modular architecture**, **AI integration best practices**, and a unique **Adaptive Difficulty Engine** that adjusts cognitive demand based on past performance.

---
## 🎥 Demonstration

<p align="center">
  <a href="https://drive.google.com/file/d/1-jCvs4U1YV8RNmI8Hz-O7qk8wlAqOUj6/view?usp=sharing">
    <img
      src="https://sm.pcmag.com/pcmag_au/review/g/google-dri/google-drive-for-business_928c.png"
      alt="AI Quiz Builder Demo"
      width="300"
    />
  </a>
</p>

> Click the thumbnail above to watch the full demonstration — covers quiz generation, answer submission, per-question feedback, and the adaptive difficulty suggestion.

---


## ✨ Features

| Feature | Description |
|---|---|
| **AI Quiz Generation** | LLaMA 3.3 70B generates 5 MCQ questions with 4 options and explanations |
| **Structured JSON Output** | LLM response parsed directly into typed DTOs — no regex |
| **Wikipedia Context Injection** | Fetches article summaries to ground factual accuracy |
| **Adaptive Difficulty Engine** | Analyses past scores and suggests next difficulty (Bloom's Taxonomy) |
| **Quiz History** | All past attempts persisted and reviewable |
| **Per-question Feedback** | Explains why each answer is correct or incorrect |
| **Model Agnostic** | Swap LLaMA 3.3 70B for Gemini by changing one config line |
| **Dev/Prod Profiles** | H2 in-memory for dev, PostgreSQL for production |

---

## 🏗 System Architecture

```
┌─────────────────────────┐             REST / JSON             ┌──────────────────────────────┐
│                         │ ◄─────────────────────────────────► │                              │
│     React 18 Frontend   │                                     │   Spring Boot 3 Backend      │
│                         │                                     │                              │
│  ┌─────────────────┐    │                                     │  ┌──────────────────────┐    │
│  │  TopicForm      │    │                                     │  │  QuizController      │    │
│  │  QuizPlayer     │    │                                     │  │  QuizService         │    │
│  │  ResultsView    │    │                                     │  │  AIGateway           │    │
│  │  HistoryPage    │    │                                     │  │  WikipediaGateway    │    │
│  └─────────────────┘    │                                     │  │  AdaptiveDifficulty  │    │
│                         │                                     │  │  Engine              │    │
│  React Query · Axios    │                                     │  └──────────────────────┘    │
│  TailwindCSS · TypeScript│                                    │                              │
└─────────────────────────┘                                     └──────────┬───────────────────┘
                                                                           │
                                                       ┌───────────────────┼────────────────┐
                                                       ▼                   ▼                ▼
                                                  LLaMA 3.3 70B API        Wikipedia API      H2 / PostgreSQL
                                                  (via Spring AI)   (REST v1)          (JPA / Hibernate)
```

### Request Flow

```
User enters topic
       │
       ▼
 QuizController  ──► QuizService ──► WikipediaGateway (fetch context)
                                          │
                                          ▼
                                     AIGateway (build prompt → call LLaMA 3.3 70B)
                                          │
                                          ▼
                                   Parse JSON → List<Question>
                                          │
                                          ▼
                                   Persist Quiz → return QuizResponse
                                          │
       ┌───────────────────────────────────┘
       │  User submits answers
       ▼
 QuizController  ──► QuizService ──► Score answers
                                          │
                                          ▼
                                   AdaptiveDifficultyEngine (analyse past N results)
                                          │
                                          ▼
                                   Persist QuizResult → return ResultResponse
```

---

## 🛠 Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Language (records, text blocks, pattern matching) |
| Spring Boot | 3.2.5 | Application framework |
| Spring AI | 0.8.1 | LLM abstraction layer — OpenAI-compatible adapter used for Groq |
| Groq API | — | Ultra-fast LPU inference hosting LLaMA 3.3 70B |
| LLaMA 3.3 70B | versatile | Open-weight LLM for quiz generation and explanations |
| Spring Data JPA | 3.2.5 | ORM and repository layer |
| Spring WebFlux (WebClient) | 3.2.5 | Non-blocking HTTP for Wikipedia API |
| Hibernate | 6.4.x | JPA implementation |
| H2 | Latest | In-memory database (dev profile) |
| PostgreSQL | 16 | Relational database (prod profile) |
| Lombok | Latest | Boilerplate reduction |
| Jackson | 2.x | JSON serialisation / deserialisation |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.4 | Type safety |
| Vite | 5.2 | Build tool and dev server |
| React Query | 3.x | Server state management and caching |
| Axios | 1.7 | HTTP client |
| TailwindCSS | 3.4 | Utility-first styling |

### External Services

| Service | Usage |
|---|---|
| Groq API (LLaMA 3.3 70B) | Ultra-fast LLM inference for quiz and explanation generation |
| Wikipedia REST API v1 | Factual context injection |

---

## 📁 Project Structure

```
quiz-builder/
│
├── backend/
│   ├── src/main/
│   │   ├── java/com/quizbuilder/
│   │   │   ├── controller/
│   │   │   │   ├── QuizController.java          # REST endpoints (4 routes)
│   │   │   │   └── GlobalExceptionHandler.java  # Centralised error handling
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── QuizService.java             # Core orchestration logic
│   │   │   │   └── AdaptiveDifficultyEngine.java # ⭐ Unique feature
│   │   │   │
│   │   │   ├── gateway/
│   │   │   │   ├── AIGateway.java               # Prompt builder + LLM caller
│   │   │   │   └── WikipediaGateway.java         # Context fetcher (WebClient)
│   │   │   │
│   │   │   ├── model/
│   │   │   │   ├── Quiz.java                    # JPA entity (questions as JSON col)
│   │   │   │   ├── QuizResult.java              # JPA entity (answers + score)
│   │   │   │   ├── Question.java                # Embedded POJO
│   │   │   │   └── Difficulty.java              # Enum with Bloom's prompt strategy
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   └── QuizDTO.java                 # All request/response shapes
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── QuizRepository.java
│   │   │   │   └── QuizResultRepository.java    # Custom JPQL for topic history
│   │   │   │
│   │   │   ├── config/
│   │   │   │   └── AppConfig.java               # CORS, ChatClient, WebClient beans
│   │   │   │
│   │   │   └── QuizBuilderApplication.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties           # Dev (H2)
│   │       └── application-prod.properties      # Prod (PostgreSQL)
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TopicForm.tsx                    # Topic input + difficulty picker
│   │   │   ├── QuizPlayer.tsx                   # MCQ renderer with progress dots
│   │   │   └── ResultsView.tsx                  # Score + feedback + next difficulty
│   │   │
│   │   ├── pages/
│   │   │   └── HistoryPage.tsx                  # Past quiz results (React Query)
│   │   │
│   │   ├── hooks/
│   │   │   └── useQuiz.ts                       # Quiz state machine (all logic)
│   │   │
│   │   ├── services/
│   │   │   └── quizApi.ts                       # All HTTP calls in one place
│   │   │
│   │   ├── types/
│   │   │   └── index.ts                         # TypeScript mirrors of backend DTOs
│   │   │
│   │   ├── App.tsx                              # Shell with tab routing
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── docker-compose.yml                           # PostgreSQL for local prod testing
└── README.md
```

---

## 📡 API Reference

### Base URL
```
http://localhost:8080/api
```

### Endpoints

#### `POST /quiz/generate`
Generate a new quiz for a given topic and difficulty.

**Request Body**
```json
{
  "topic": "Neural Networks",
  "difficulty": "INTERMEDIATE"
}
```

| Field | Type | Values |
|---|---|---|
| `topic` | `String` | Any subject (e.g. "Photosynthesis") |
| `difficulty` | `Enum` | `BEGINNER` · `INTERMEDIATE` · `ADVANCED` |

**Response** `201 Created`
```json
{
  "id": 1,
  "topic": "Neural Networks",
  "difficulty": "INTERMEDIATE",
  "questions": [
    {
      "index": 0,
      "text": "What is the role of an activation function in a neural network?",
      "options": {
        "A": "To initialise weights",
        "B": "To introduce non-linearity",
        "C": "To reduce the learning rate",
        "D": "To normalise input data"
      },
      "correctOption": "B",
      "explanation": "Activation functions introduce non-linearity, enabling the network to learn complex patterns beyond simple linear transformations."
    }
  ],
  "createdAt": "2025-06-29T08:30:00Z"
}
```

---

#### `POST /quiz/{id}/submit`
Submit answers and receive scored results with feedback.

**Request Body**
```json
{
  "answers": {
    "0": "B",
    "1": "A",
    "2": "C",
    "3": "D",
    "4": "B"
  }
}
```

**Response** `200 OK`
```json
{
  "resultId": 1,
  "quizId": 1,
  "topic": "Neural Networks",
  "score": 4,
  "total": 5,
  "feedback": [
    {
      "index": 0,
      "questionText": "What is the role of an activation function?",
      "selectedOption": "B",
      "correctOption": "B",
      "correct": true,
      "explanation": "Activation functions introduce non-linearity..."
    }
  ],
  "suggestedNextDifficulty": "ADVANCED"
}
```

---

#### `GET /quiz/history`
Returns all past quiz results, newest first.

**Response** `200 OK`
```json
[
  {
    "resultId": 1,
    "quizId": 1,
    "topic": "Neural Networks",
    "difficulty": "INTERMEDIATE",
    "score": 4,
    "total": 5,
    "submittedAt": "2025-06-29T08:35:00Z"
  }
]
```

---

#### `GET /quiz/{id}`
Fetch a full quiz by ID (for review mode).

**Response** `200 OK` — same schema as `/quiz/generate` response.

---

### Error Responses

All errors follow [RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457) format:

```json
{
  "type": "/errors/not-found",
  "title": "Not Found",
  "status": 404,
  "detail": "Quiz not found: 99"
}
```

| Status | Type | Cause |
|---|---|---|
| `400` | `/errors/validation` | Missing or invalid request fields |
| `404` | `/errors/not-found` | Quiz or result ID does not exist |
| `502` | `/errors/ai-gateway` | LLM returned unparseable response |
| `500` | `/errors/internal` | Unexpected server error |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Java JDK | 21+ |
| Maven | 3.9+ (or use included `mvnw`) |
| Node.js | 18+ |
| npm | 9+ |
| Groq API Key | Required — [get one here](https://console.groq.com/keys) |

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/quiz-builder.git
cd quiz-builder
```

---

### 2. Configure the Groq API key

Get your free API key from **[console.groq.com/keys](https://console.groq.com/keys)**. Keys start with `gsk_`.

**Option A — IntelliJ Run Configuration (recommended for dev)**

```
Run → Edit Configurations → QuizBuilderApplication
→ Environment Variables → Add:
  Name:  GROQ_API_KEY
  Value: gsk_...
```

**Option B — Terminal (current session only)**

```bash
# Windows (CMD)
set GROQ_API_KEY=gsk_...

# Windows (PowerShell)
$env:GROQ_API_KEY="gsk_..."

# macOS / Linux
export GROQ_API_KEY=gsk_...
```

---

### 3. Run the backend

```bash
cd backend

# Using Maven wrapper (no Maven installation needed)
./mvnw spring-boot:run          # macOS / Linux
mvnw.cmd spring-boot:run        # Windows
```

Backend starts at **http://localhost:8080**

Verify with:
```bash
curl http://localhost:8080/api/quiz/history
# Expected: []
```

H2 console available at: **http://localhost:8080/h2-console**
```
JDBC URL:  jdbc:h2:mem:quizdb
Username:  sa
Password:  (leave blank)
```

---

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at **http://localhost:5173**

---

### 5. Quick API test (Postman or curl)

```bash
curl -X POST http://localhost:8080/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d "{\"topic\": \"Photosynthesis\", \"difficulty\": \"BEGINNER\"}"
```

A successful response returns a JSON object with 5 quiz questions.

---

## ⚙️ Configuration

All configuration lives in `backend/src/main/resources/`.

### `application.properties` (Dev — H2)

```properties
# Server
server.port=8080
app.cors.allowed-origins=http://localhost:5173

# Groq via Spring AI OpenAI-compatible adapter (reads from env variable)
spring.ai.openai.api-key=${GROQ_API_KEY}
spring.ai.openai.base-url=https://api.groq.com/openai
spring.ai.openai.chat.options.model=llama-3.3-70b-versatile
spring.ai.openai.chat.options.temperature=0.7

# H2 in-memory database
spring.datasource.url=jdbc:h2:mem:quizdb;DB_CLOSE_DELAY=-1
spring.h2.console.enabled=true
spring.jpa.hibernate.ddl-auto=create-drop

# Feature flags
app.wikipedia.enabled=true
app.wikipedia.base-url=https://en.wikipedia.org/api/rest_v1
app.quiz.questions-per-quiz=5
```

### `application-prod.properties` (Prod — PostgreSQL)

```properties
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:5432/${DB_NAME:quizdb}
spring.datasource.username=${DB_USER:postgres}
spring.datasource.password=${DB_PASS:postgres}
spring.jpa.hibernate.ddl-auto=update
spring.h2.console.enabled=false
```

Activate with:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

### Switching to a different model

Since Spring AI uses the OpenAI-compatible API format and Groq exposes the same interface, switching models requires only a config change:

```properties
# Switch to a different Groq-hosted model — no code change needed
spring.ai.openai.chat.options.model=llama-3.1-8b-instant     # faster, lighter
spring.ai.openai.chat.options.model=mixtral-8x7b-32768       # alternative
spring.ai.openai.chat.options.model=gemma2-9b-it             # Google Gemma via Groq
```

To switch to a non-Groq provider (e.g., Gemini), replace the starter in `pom.xml` and update the provider-specific properties. No Java code changes required.

---

## 🤖 AI Design Decisions

### Why Groq + LLaMA 3.3 70B?

Groq provides ultra-fast inference via its custom LPU (Language Processing Unit) hardware. LLaMA 3.3 70B on Groq delivers:

- **Sub-second response times** for quiz generation — significantly faster than hosted GPT-4o
- **Free tier** with generous rate limits — ideal for a development prototype
- **OpenAI-compatible API** — Spring AI's OpenAI adapter works out of the box by simply pointing `base-url` at Groq's endpoint
- **No vendor lock-in** — switching back to OpenAI or to Gemini requires only config changes

### Why Spring AI?

Spring AI provides a model-agnostic abstraction over LLM providers (OpenAI, Groq, Google Gemini, Azure OpenAI, Mistral). The model and provider are configuration values, not code dependencies — switching providers requires changing `pom.xml` and `application.properties` only. Groq's OpenAI-compatible interface means the `spring-ai-openai-spring-boot-starter` works directly — no separate Groq starter needed.

### Structured JSON Output

The system prompt enforces a strict JSON schema. The LLM is instructed to return only valid JSON matching a defined structure. Jackson maps the response directly into `List<Question>` — no string parsing, no regex, fully type-safe.

```
System prompt → defines JSON schema
User prompt   → topic + difficulty strategy + optional Wikipedia context
LLM response  → raw JSON string
AIGateway     → Jackson deserialises → List<Question>
```

### Wikipedia Context Injection

For factual topics (history, science, geography), `WikipediaGateway` fetches an article summary (≤1500 characters) and injects it into the prompt as grounding context. This significantly reduces hallucination. The feature is toggled via `app.wikipedia.enabled` — it is disabled gracefully when the topic is conceptual (e.g., "clean code principles") where the model's internal knowledge is more reliable.

---

## ⭐ Unique Feature — Adaptive Difficulty Engine

### Overview

After each quiz submission, `AdaptiveDifficultyEngine` analyses the user's recent performance on that topic and recommends the optimal difficulty for the next attempt. This turns a one-shot quiz into a **learning loop**.

### How It Works

```
Last 3 results for topic → compute average score ratio
       │
       ├── avg ≥ 80%  →  bump up one difficulty level
       ├── avg ≤ 40%  →  drop down one level
       └── otherwise  →  hold current level
```

### Bloom's Taxonomy Integration

Each difficulty level maps to a distinct **prompt strategy** (not just a label), requesting a different cognitive level from the LLM:

| Level | Bloom's Level | Prompt Strategy |
|---|---|---|
| `BEGINNER` | Recall & Comprehension | Foundational questions; distractors address common misconceptions |
| `INTERMEDIATE` | Application & Understanding | Requires applying concepts; plausible distractors |
| `ADVANCED` | Analysis, Evaluation & Synthesis | Deep conceptual questions; sophisticated distractors |

### Why This Is Meaningful

Standard difficulty selectors just relabel the same question style. This engine changes the **cognitive demand** injected into the prompt — the LLM produces genuinely different questions at each level, not just harder vocabulary.

---

## 🧪 Running Tests

```bash
cd backend
./mvnw test
```

Test coverage includes:
- `QuizServiceTest` — mocks AIGateway and WikipediaGateway; verifies orchestration logic
- `AdaptiveDifficultyEngineTest` — unit tests for all threshold scenarios
- `QuizControllerTest` — integration tests for all four endpoints using MockMvc

---

## 🐳 Deployment

### Local PostgreSQL (via Docker Compose)

```bash
# From project root
docker-compose up -d

# Then run backend with prod profile
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod \
  -Dspring-boot.run.jvmArguments="-DGROQ_API_KEY=gsk_..."
```

### Environment Variables Required for Production

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key — get from [console.groq.com/keys](https://console.groq.com/keys) |
| `DB_HOST` | PostgreSQL host (default: `localhost`) |
| `DB_NAME` | Database name (default: `quizdb`) |
| `DB_USER` | Database username (default: `postgres`) |
| `DB_PASS` | Database password |

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ☕ Java, ⚛️ React, and 🦙 LLaMA 3.3 70B via Groq

**Yuvraj Khade** — Computer Engineering, PCCOE Pune

</div>
