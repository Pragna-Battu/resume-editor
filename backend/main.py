from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Union

app = FastAPI()

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def enhance_content(section: str, content: Union[str, Dict]) -> Union[str, Dict]:
    """Generate realistic enhanced content based on the section"""
    if section == "experience":
        enhanced = {
            "role": f"Senior {content.get('role', 'Developer')}",
            "company": f"{content.get('company', 'Company')} Inc.",
            "description": f"Responsible for leading {content.get('role', 'development')} team at {content.get('company', 'the company')}",
            "achievements": [
                f"Improved {content.get('role', 'department')} processes by 30%",
                f"Led successful projects at {content.get('company', 'the company')}"
            ]
        }
    elif section == "education":
        enhanced = {
            "degree": f"Master's in {content.get('degree', 'Computer Science')}",
            "university": f"{content.get('university', 'University')} (Honors)",
            "year": "2020-2022",
            "gpa": "3.8/4.0",
            "thesis": f"Advanced research in {content.get('degree', 'the field')}"
        }
    elif section == "skills":
        enhanced = f"Expert in {content} with 5+ years experience"
    else:
        enhanced = content
    
    return enhanced

@app.post("/ai-enhance")
async def ai_enhance(request: Request):
    try:
        data = await request.json()
        enhanced = enhance_content(data['section'], data['content'])
        return {
            "status": "success",
            "enhanced_content": enhanced
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@app.post("/save-resume")
async def save_resume(request: Request):
    try:
        data = await request.json()
        # In a real app, you would save to database here
        return {
            "status": "success",
            "message": "Resume saved",
            "resume": data
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@app.get("/")
def read_root():
    return {"message": "Resume Editor API is running"}