"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (result) {
      let start = 0;
      const end = result.match_score;
      const duration = 800;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedScore(end);
          clearInterval(timer);
        } else {
          setAnimatedScore(start.toFixed(0));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [result]);

  const handleAnalyze = async () => {
    if (!file || !jd) {
      alert("Upload resume and add JD");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jd);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);

      setTimeout(() => {
        const el = document.getElementById("results");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);

    } catch (err) {
      console.error(err);
      alert("Error connecting backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <div className="logo">ResumeAI</div>
          <div className="nav-pill">Beta · Free</div>
        </div>
      </nav>

      <div className="container">
        {/* HERO */}
        <div className="hero">
          <div className="hero-badge">
            <span></span> Powered by AI · Instant Analysis
          </div>

          <h1>
            Your resume,<br />
            <em>intelligently scored</em>
          </h1>

          <p className="hero-sub">
            Upload your resume, paste the job description, and get a detailed AI-powered match report in seconds.
          </p>
        </div>

        <div className="divider"></div>

        {/* STEP 1 */}
        <div>
          <div className="step-label">Step 01</div>
          <div className="section-title">Upload Your Resume</div>
          <p className="section-sub">Drag & drop your resume file or click to browse.</p>

          <div className="card" style={{ padding: 0 }}>
            <div className="upload-zone"
              onClick={() => fileInputRef.current.click()}>
              <div className="upload-icon">📄</div>
              <div className="upload-title">Drop your resume here</div>
              <div className="upload-sub">or browse files</div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
          />
          {file && (
            <div style={{ marginTop: "12px", color: "#00e5c3" }}>
              ✅ {file.name}
            </div>
          )}
        </div>

        {/* STEP 2 */}
        <div style={{ marginTop: "30px" }}>
          <div className="step-label">Step 02</div>
          <div className="section-title">Paste Job Description</div>

          <div className="card">
            <textarea
              className="jd-area"
              placeholder="Paste job description..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* BUTTON */}
        <div className="cta-wrap">
          <button
            className={`btn-analyze ${loading ? "loading" : ""}`}
            onClick={handleAnalyze}
            disabled={loading}
          >
            <span className="btn-icon">⚡</span>
            <div className="spinner"></div>
            <span className="btn-text">
              {loading ? "Analyzing..." : "Analyze Resume"}
            </span>
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <div id="results" className="visible shown">

            <div className="results-header">
              <div className="results-title">Analysis Report</div>
              <span className={`results-badge ${
                result.fit_level === "High Match"
                  ? "badge-high"
                  : result.fit_level === "Moderate Match"
                  ? "badge-medium"
                  : "badge-low"
              }`}>
                {result.fit_level}
              </span>
            </div>

            {/* SCORE */}
            <div className="score-row items-stretch">
              <div className="score-card flex flex-col justify-center items-center h-full">
                <div className="fit-label">Overall Match Score</div>

                <div style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #4f8dff, #a259ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginTop: "10px"
                }}>
                  {animatedScore}%
                </div>
              </div>

              <div className="fit-card flex flex-col justify-center items-center h-full">
                <div className="fit-label">Fit Level</div>

                <div style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #4f8dff, #a259ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginTop: "10px"
                }}>
                  {result.fit_level}
                </div>
              </div>
            </div>

            {/* MATCHED */}
            <div className="tags-card">
              <div className="tags-title">
                <span className="dot dot-green"></span> Matched Skills
              </div>

              <div className="tag-list">
                {result.matched_skills.map((skill, i) => (
                  <span key={i} className="tag tag-match">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* MISSING */}
            <div className="tags-card">
              <div className="tags-title">
                <span className="dot dot-red"></span> Missing Skills
              </div>

              <div className="tag-list">
                {result.missing_skills.map((skill, i) => (
                  <span key={i} className="tag tag-miss">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* SUGGESTIONS */}
            <div className="sug-card">
              <div className="sug-title">💡 Suggestions</div>

              <div className="sug-list">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="sug-item">
                    <div className="sug-num">{i + 1}</div>
                    <div className="sug-text">{s}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}