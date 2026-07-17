# 🏟️ StadiumIQ AI - FIFA World Cup 2026 Smart Stadium & Operations

StadiumIQ AI is a production-ready, highly interactive GenAI-powered web application designed for the **FIFA World Cup 2026**. It optimizes smart stadium and tournament operations for fans, volunteers, security personnel, venue managers, transport operators, and organizers.

---

## 🏆 Key Dashboards & User Roles

The platform provides a customized, responsive experience tailored to 6 user roles:
1. **Fan Dashboard**: Smart navigation routes (including wheelchair ramps), match commentary, food finder, and Lost & Found items matching.
2. **Volunteer Dashboard**: Incident logger, translation assistant, and shift info.
3. **Security Staff Dashboard**: Structured incident logs and crowd flow trend lines.
4. **Organizer Command Center**: Real-time attendance logs and morning briefings by Gemini.
5. **Transport Manager Dashboard**: Metro/shuttle ETAs and transit share distribution.
6. **Stadium Administrator**: Sustainability score tracking and carbon/recycling metrics.

---

## 🌟 Premium Design & Visual Polish

* **Glassmorphic UI**: Vibrant glass-backdrop panels with soft shadows and glowing borders.
* **Animated Background Mesh**: Smooth, floating ambient light backdrops that drift slowly during interaction.
* **Refined Micro-interactions**: Smooth hover scale changes, active button scale triggers, and glint-reflection animations.
* **A11y (Accessibility)**: Full support for high-contrast accessibility mode and voice assistance synthesis (TTS & STT).
* **Emergency Mode**: Quick EVAC triggers that toggle flashing warnings and map evacuation lanes instantly.

---

## 💻 Tech Stack

* **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS (v4), Recharts, Lucide Icons.
* **Backend**: Python FastAPI, Pydantic, Uvicorn, Python-dotenv.
* **AI Integration**: Gemini API (`google-generativeai`) with custom fallback simulations.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0 or newer
* **Python**: v3.9 or newer

---

### ⚡ Option A: One-Click Automatic Startup (Windows)
Double-click the **`run.bat`** file at the root of the workspace. This script will automatically launch:
1. The **FastAPI Backend** on `http://127.0.0.1:8000`.
2. The **Next.js Frontend** dev server on `http://localhost:3000`.

---

### 🛠️ Option B: Manual Setup & Execution (All OS)

#### 1. Setup & Run the Python FastAPI Backend:
1. Open your terminal at the project root directory.
2. Install python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. (Optional) Create a `.env` file inside the `backend` directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: If no API key is specified, the backend will automatically enter a comprehensive simulation fallback mode.*
4. Start the FastAPI server using Uvicorn:
   ```bash
   python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
   ```

#### 2. Setup & Run the Next.js Frontend:
1. Open a new terminal window in the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

---

### 🌐 Accessing the Application
Once the services are running, open your browser and navigate to:
* **Frontend UI**: 👉 **[http://localhost:3000](http://localhost:3000)**
* **Backend API Docs (Swagger UI)**: 👉 **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## 📂 Project Structure
```
StadiumIQ AI/
├── backend/
│   ├── main.py             # FastAPI App with Gemini Routing & Simulators
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx     # Fully-featured Next.js Dashboard UI
│   │       ├── layout.tsx   # Font bindings and SEO metadata
│   │       └── globals.css  # Themes, variables, and animations
│   └── package.json
├── run.bat                 # One-click launcher script
├── NAVIGATE_GUIDE.md       # Interactive guide
└── README.md               # Project documentation
```
