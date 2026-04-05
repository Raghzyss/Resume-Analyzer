from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from backend.utils.pdf_parser import extract_text_from_pdf
from backend.utils.preprocess import clean_text
from backend.models.similarity import compute_similarity
from backend.utils.skill_extractor import extract_skills
from backend.services.suggestions import generate_suggestions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AI Resume Analyzer Backend Running"}


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    raw_text = extract_text_from_pdf(file.file)
    cleaned_text = clean_text(raw_text)

    return {
        "filename": file.filename,
        "cleaned_text_preview": cleaned_text[:500]
    }


@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    # extract + clean resume
    raw_text = extract_text_from_pdf(file.file)
    resume_text = clean_text(raw_text)

    # clean JD
    jd_text = clean_text(job_description)

    # TF-IDF score
    tfidf_score = compute_similarity(resume_text, jd_text)

    # extract skills
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)

    # matched + missing
    matched_skills = list(set(resume_skills) & set(jd_skills))
    missing_skills = list(set(jd_skills) - set(resume_skills))

    # skill-based score
    if len(jd_skills) > 0:
        skill_score = (len(matched_skills) / len(jd_skills)) * 100
    else:
        skill_score = 0

    # final hybrid score
    final_score = round((0.5 * tfidf_score) + (0.5 * skill_score), 2)

    # fit level logic (based on final score)
    if final_score < 30:
        fit_level = "Low Match"
    elif final_score < 60:
        fit_level = "Moderate Match"
    else:
        fit_level = "High Match"
    
    # suggestions
    suggestions = generate_suggestions(missing_skills)

    return {
        "match_score": final_score,
        "tfidf_score": tfidf_score,
        "skill_score": round(skill_score, 2),
        "fit_level": fit_level,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions
    }