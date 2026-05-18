# CricVision AI 🏏🤖

CricVision AI is a premium, AI-powered cricket analytics platform that transforms raw match data into intelligent, explainable, and predictive insights.

## 🚀 Features

- **Premium Dashboard**: Modern, glassmorphic UI with real-time analytics.
- **AI Cricket Assistant**: Powered by GROQ (Llama 3), providing deep tactical insights.
- **Predictive Engine**: ML-driven win probability and player performance forecasting.
- **Advanced Visualizations**: Interactive radar charts, area graphs, and performance heatmaps.
- **Relational Intelligence**: Deep player and team comparison metrics.

## 🛠 Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS 4, Framer Motion, Shadcn/UI, Recharts.
- **Backend**: FastAPI (Python), GROQ API, Scikit-Learn.
- **Database**: Supabase (PostgreSQL).

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/criccortex.git
cd criccortex
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Update .env with your GROQ and Supabase keys
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Update .env.local with your Supabase keys
npm run dev
```

## 📐 Architecture

- `/frontend`: Next.js App Router project with responsive UI.
- `/backend`: FastAPI modular backend with AI/ML services.
- `/database`: SQL schema and seed scripts for Supabase.
- `/ml`: Training scripts and datasets.

## 🌟 Unique Selling Points (USP)

1. **Contextual Analysis**: Explains the "Why" behind match results using AI.
2. **Predictive Modeling**: Real-time forecasting instead of just historical stats.
3. **Conversational Intelligence**: Ask the app anything about cricket performance.
4. **Premium SaaS Experience**: Clean, modern, and dark-themed interface.
