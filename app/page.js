// app/page.js
"use client";
import { useState } from "react";
import { calcPHQ9, calcGAD7, PHQ9_QUESTIONS, GAD7_QUESTIONS, ANSWER_OPTIONS } from "../lib/scores";

export default function Home() {
  const [phq9Answers, setPhq9Answers] = useState(Array(9).fill(null));
  const [gad7Answers, setGad7Answers] = useState(Array(7).fill(null));
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const totalQuestions = 9 + 7;
  const answered =
    phq9Answers.filter((a) => a !== null).length +
    gad7Answers.filter((a) => a !== null).length;
  const allDone = answered === totalQuestions;

  const handlePhq9 = (qi, value) => {
    const next = [...phq9Answers];
    next[qi] = value;
    setPhq9Answers(next);
  };

  const handleGad7 = (qi, value) => {
    const next = [...gad7Answers];
    next[qi] = value;
    setGad7Answers(next);
  };

  const handleSubmit = async () => {
    setStatus("loading");
    setError("");

    const phq9 = calcPHQ9(phq9Answers);
    const gad7 = calcGAD7(gad7Answers);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phq9, gad7, phq9Answers, gad7Answers }),
      });
      const data = await res.json();
      setResult(data);
      setStatus("done");
    } catch (err) {
      setError("Something went wrong. Check your API key and terminal for errors.");
      setStatus("error");
    }
  };

  const reset = () => {
    setPhq9Answers(Array(9).fill(null));
    setGad7Answers(Array(7).fill(null));
    setResult(null);
    setStatus("idle");
    setError("");
  };

  const severityColor = (s) => {
    if (!s) return "#888";
    if (s.includes("minimal")) return "#1D9E75";
    if (s.includes("mild")) return "#BA7517";
    return "#A32D2D";
  };

  const renderQuestionBlock = (questions, answers, onAnswer, prefix) => (
    <>
      {questions.map((q, qi) => (
        <div
          key={`${prefix}-${qi}`}
          style={{
            background: "#fff",
            border: "0.5px solid #e0e0e0",
            borderRadius: 12,
            padding: "1rem 1.25rem",
            marginBottom: 10,
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, lineHeight: 1.5 }}>
            {qi + 1}. {q}
            {prefix === "phq9" && qi === 8 && (
              <span style={{ display: "block", fontSize: 12, color: "#A32D2D", marginTop: 4, fontWeight: 400 }}>
                ⚠ If you answer anything other than "Not at all", you will see crisis resources.
              </span>
            )}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
            {ANSWER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onAnswer(qi, opt.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  cursor: "pointer",
                  border: answers[qi] === opt.value ? "2px solid #1D9E75" : "0.5px solid #ddd",
                  background: answers[qi] === opt.value ? "#E1F5EE" : "#fafafa",
                  color: answers[qi] === opt.value ? "#085041" : "#555",
                  fontWeight: answers[qi] === opt.value ? 500 : 400,
                  textAlign: "left",
                  transition: "all .1s",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 6 }}>Stress & Mood Check-in</h1>
      <p style={{ fontSize: 14, color: "#666", marginBottom: "1.5rem", lineHeight: 1.6 }}>
        PHQ-9 (depression) + GAD-7 (anxiety) · Takes about 4 minutes · {answered}/{totalQuestions} answered
      </p>

      <div style={{ height: 4, background: "#eee", borderRadius: 2, marginBottom: "1.5rem", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${(answered / totalQuestions) * 100}%`,
            background: "#1D9E75",
            transition: "width .3s",
            borderRadius: 2,
          }}
        />
      </div>

      {status !== "done" && (
        <>
          <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 10, marginTop: 4 }}>
            Part 1 — Depression screen (PHQ-9)
          </h2>
          {renderQuestionBlock(PHQ9_QUESTIONS, phq9Answers, handlePhq9, "phq9")}

          <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 10, marginTop: 20 }}>
            Part 2 — Anxiety screen (GAD-7)
          </h2>
          {renderQuestionBlock(GAD7_QUESTIONS, gad7Answers, handleGad7, "gad7")}

          {error && (
            <div
              style={{
                background: "#FCEBEB",
                border: "0.5px solid #F09595",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#791F1F",
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!allDone || status === "loading"}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 500,
              background: allDone ? "#1D9E75" : "#ccc",
              color: "#fff",
              border: "none",
              cursor: allDone ? "pointer" : "not-allowed",
              marginTop: 4,
            }}
          >
            {status === "loading"
              ? "Claude is analyzing…"
              : allDone
                ? "Analyze with AI →"
                : `Answer all questions (${totalQuestions - answered} remaining)`}
          </button>
        </>
      )}

      {status === "done" && result && (
        <div>
          {result.crisis && (
            <div
              style={{
                background: "#FCEBEB",
                border: "1px solid #F09595",
                borderRadius: 10,
                padding: "14px 16px",
                color: "#791F1F",
                marginBottom: 16,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              <strong>Important:</strong> {result.crisisMessage}
            </div>
          )}

          {!result.crisis && (
            <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "1.25rem" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <div
                  style={{
                    flex: 1,
                    background: "#f5f5f5",
                    border: "0.5px solid #ddd",
                    borderRadius: 8,
                    padding: "10px 14px",
                  }}
                >
                  <div style={{ fontSize: 11, color: "#888" }}>Depression (PHQ-9)</div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: severityColor(result.depression_severity) }}>
                    {result.depression_severity} · {result.depression_score}/27
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    background: "#f5f5f5",
                    border: "0.5px solid #ddd",
                    borderRadius: 8,
                    padding: "10px 14px",
                  }}
                >
                  <div style={{ fontSize: 11, color: "#888" }}>Anxiety (GAD-7)</div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: severityColor(result.anxiety_severity) }}>
                    {result.anxiety_severity} · {result.anxiety_score}/21
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: "1rem" }}>{result.summary}</p>

              {result.possible_indicators?.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Possible indicators</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {result.possible_indicators.map((ind, i) => (
                      <span
                        key={i}
                        style={{ background: "#EEEDFE", color: "#3C3489", fontSize: 12, padding: "3px 10px", borderRadius: 6 }}
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Recommendations</p>
              {result.recommendations?.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: "7px 0",
                    borderBottom: i < result.recommendations.length - 1 ? "0.5px solid #f0f0f0" : "none",
                    fontSize: 13,
                    color: "#555",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#1D9E75", fontSize: 14, marginTop: 1 }}>✓</span>
                  {r}
                </div>
              ))}

              {result.seek_professional && (
                <div
                  style={{
                    background: "#FAEEDA",
                    borderRadius: 8,
                    padding: "10px 12px",
                    marginTop: 12,
                    fontSize: 13,
                    color: "#633806",
                  }}
                >
                  ⚠ Based on your scores, speaking with a mental health professional is recommended.
                </div>
              )}
            </div>
          )}

          <p style={{ fontSize: 11, color: "#999", marginTop: 12, lineHeight: 1.6 }}>
            This tool provides possible indicators only — not a clinical diagnosis. Always consult a qualified
            healthcare provider for medical advice.
          </p>

          <button
            onClick={reset}
            style={{
              width: "100%",
              marginTop: 10,
              padding: "10px",
              borderRadius: 8,
              fontSize: 14,
              background: "#f5f5f5",
              border: "0.5px solid #ddd",
              cursor: "pointer",
              color: "#555",
            }}
          >
            Start over
          </button>
        </div>
      )}
    </main>
  );
}