<div align="center">

# 🧠 MindConnect

### *Intelligent, Clinically-Grounded Mental Health & Mood Screening Platform*

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Groq](https://img.shields.io/badge/Groq-LPU_Inference-F05A28?style=for-the-badge&logo=fastapi&logoColor=white)](https://groq.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <b>MindConnect</b> bridges the gap between clinical psychometric screening and modern AI-assisted wellness support. By combining the validated <b>PHQ-9</b> (Depression) and <b>GAD-7</b> (Anxiety) diagnostic questionnaires with lightning-fast <b>Groq LPU</b> inference and real-time <b>Crisis Safety Protocols</b>, MindConnect delivers immediate, empathetic, and actionable mental health insights with complete data privacy.
</p>

[Key Features](#-key-features) • [Clinical Foundations](#-clinical-foundations) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Environment Variables](#-environment-variables) • [Safety & Ethics](#-safety-first-philosophy)

</div>

---

## 🌟 Key Features

- 📋 **Dual Standardized Psychometric Assessments**:
  - **PHQ-9 (Patient Health Questionnaire)** for depressive symptomatology and severity mapping (0–27).
  - **GAD-7 (Generalized Anxiety Disorder)** for anxiety severity categorization (0–21).
- 🚨 **Zero-Latency Crisis Interception Protocol**:
  - Instant client-side detection of self-harm ideation (PHQ-9 Question 9).
  - Server-side circuit breaker prioritizing immediate access to verified crisis hotlines (988 Suicide & Crisis Lifeline, Crisis Text Line 741741, international directories).
- ⚡ **Ultra-Fast Empathetic AI Synthesis**:
  - Powered by **Groq LPU** inference for sub-second analysis.
  - Generates plain-language synopses, cross-scale correlative insights, potential indicators, and actionable personalized self-care recommendations.
- 🔒 **Secure Cloud Session Persistence**:
  - Built with **Supabase (PostgreSQL)** to log score metrics, crisis telemetry, and longitudinal data safely.
- 🎨 **Minimalist, Human-Centered UX**:
  - Intuitive step-by-step progress tracking, gentle color indicators, responsive card components, and distraction-free typography.

---

## 🔬 Clinical Foundations

MindConnect implements universally recognized, validated psychiatric rating scales:

### 1. PHQ-9 (Depression Scale)
| Score Range | Severity Band | Clinical Guidance |
| :--- | :--- | :--- |
| **0 – 4** | Minimal / None | Monitor; regular wellness habits |
| **5 – 9** | Mild | Watchful waiting; self-care interventions |
| **10 – 14** | Moderate | Clinical consultation recommended |
| **15 – 19** | Moderately Severe | Active treatment & professional therapy |
| **20 – 27** | Severe | Immediate clinical intervention & specialist care |

### 2. GAD-7 (Anxiety Scale)
| Score Range | Severity Band | Clinical Guidance |
| :--- | :--- | :--- |
| **0 – 4** | Minimal | Standard stress-management routines |
| **5 – 9** | Mild | Mindfulness, sleep hygiene, lifestyle adjustments |
| **10 – 14** | Moderate | Formal evaluation by healthcare provider |
| **15 – 21** | Severe | Multimodal clinical management |

---

## 🏗️ Architecture & Data Flow

```
[ User Interaction ] 
       │
       ▼
[ Client Validation ] ───► (PHQ-9 Q9 Flagged?) ───► [ Immediate Crisis Banner (Hotlines) ]
       │                                                         │
       │ (Calculated Scores & Answers)                           │
       ▼                                                         ▼
[ POST /api/analyze ] ─────────────────────────────► [ Supabase DB: Crisis Session Log ]
       │
       ├──► Crisis Detected? ───► Return Instant Emergency Directives
       │
       ▼ (Safe flow)
[ Groq Cloud LPU Inference ]
       │  • Compassionate clinical system framing
       │  • Structured JSON response parsing
       ▼
[ Supabase DB: Session Record ]
       │
       ▼
[ Interactive Personalized Dashboard ]
       • Depression & Anxiety Severity Breakdown
       • Cross-Score Synthesis Summary
       • Possible Clinical Indicators
       • Tailored Actionable Coping Strategies
       • Professional Consultation Advisory
```

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) |
| **Styling** | Native Modern Modular CSS / Semantic Design Tokens |
| **AI Inference Engine** | [Groq SDK](https://console.groq.com/) (LLaMA / GPT-OSS models via Groq LPUs) |
| **Database & Backend** | [Supabase](https://supabase.com/) (PostgreSQL Serverless Backend) |
| **Language** | JavaScript (ESNext, React Server/Client Components) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.18+ or v20+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
- A free [Groq Cloud Account](https://console.groq.com/)
- A free [Supabase Account](https://supabase.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/professorofai/MindConnect-.git
cd MindConnect-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create your local environment file:

```bash
cp .env.example .env.local
```

Populate `.env.local` with your credentials:

```ini
# Groq Cloud API Key
GROQ_API_KEY=your_groq_api_key_here

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Database Setup (Supabase)

Execute the following SQL in your Supabase SQL Editor:

```sql
create table questionnaire_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  phq9_score integer not null,
  phq9_severity text not null,
  phq9_answers jsonb,
  gad7_score integer not null,
  gad7_severity text not null,
  gad7_answers jsonb,
  crisis_flag boolean default false,
  ai_summary text,
  possible_indicators jsonb,
  recommendations jsonb,
  seek_professional boolean
);
```

### 5. Launch the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
MindConnect/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.js       # AI analysis pipeline & crisis guardrails
│   ├── globals.css            # Base styles and CSS variables
│   ├── layout.js              # Root Next.js layout
│   └── page.js                # Core assessment UI & state management
├── components/
│   └── CrisisBanner.jsx       # Emergency lifeline & resource banner
├── lib/
│   ├── crisis.js              # Safety logic & 24/7 crisis resource directory
│   ├── scores.js              # Pure PHQ-9 & GAD-7 scoring algorithms
│   └── supabase.js            # Initialized Supabase client instance
├── .env.example               # Sanitized environment template
├── next.config.mjs            # Next.js build & compiler configurations
├── package.json               # Dependencies and scripts
└── README.md                  # Project documentation
```

---

## 🛡️ Safety-First Philosophy

> **IMPORTANT MEDICAL DISCLAIMER**
> 
> MindConnect is an educational and supportive wellness screening application. It is **not** a diagnostic device, clinical tool, or substitute for professional medical, psychiatric, or psychological evaluation, diagnosis, or treatment. 
> 
> **Immediate Help**: If you or someone you know is struggling or in crisis:
> - **In the US / Canada**: Call or text **988**, or text `HOME` to **741741**.
> - **In the UK**: Call **111** or contact Samaritans at **116 123**.
> - **International**: Visit [findahelpline.com](https://findahelpline.com/) to locate free, confidential support in your country.

---

## 🤝 Contributing

Contributions, feedback, and suggestions are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/InnovativeFeature`)
3. Commit your Changes (`git commit -m 'feat: Add innovative feature'`)
4. Push to the Branch (`git push origin feature/InnovativeFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built with compassion and modern AI for a healthier mind.</sub>
</div>
