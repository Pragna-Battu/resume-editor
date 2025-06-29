# Resume Editor - Internship Assignment 
*A web-based resume editor with AI-enhanced content suggestions*
## ✅ Functional Requirements

### Frontend (React.js)
- **File Upload**: Accept PDF/DOCX (mock parsing)
- **Editable Fields**: 
  - Name, experience, education, skills
  - Add/remove entries
- **AI Enhancement**: 
  - "Enhance with AI" button per section
  - Calls `/ai-enhance` endpoint
- **Save/Download**: 
  - Save to backend via `/save-resume`
  - Download as JSON

### Backend (FastAPI)
- `POST /ai-enhance`: Returns mocked enhanced content
- `POST /save-resume`: Stores resume in memory/disk

## 🛠️ Tech Stack
| Component | Technologies |
|-----------|--------------|
| Frontend  | React.js 18 |
| Backend   | FastAPI, Python 3.10+ |
| Build Tools | Vite, npm |

## 🚀 Setup Instructions

### Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
pip install -r requirements.txt
# Resume Editor - Internship Project

### 🖥️ **Frontend Setup**
```bash
cd frontend
npm install

🚀 Running the Application

Start Backend:
cd backend
py -m uvicorn main:app --reload
📄 API Docs available at: http://localhost:8000/docs

Start Frontend (in new terminal):
cd frontend
npm install
npm start

🌐 Application running at: http://localhost:3000

📁 Project Structure

resume-editor/
├── frontend/
│   ├── src/          # React components
│   ├── public/       # Static assets
│   └── vite.config.js
├── backend/
│   ├── main.py       # FastAPI routes
│   └── requirements.txt
└── README.md



