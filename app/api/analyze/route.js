// app/api/analyze/route.js
import Groq from "groq-sdk";
import { supabase } from "../../../lib/supabase";

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
    const { phq9, gad7, phq9Answers, gad7Answers } = await request.json();

    // Crisis check — always runs first, before anything else
    if (phq9.crisisFlag) {
        // Still save crisis sessions to the database for tracking
        await supabase.from("questionnaire_sessions").insert({
            phq9_score: phq9.total,
            phq9_severity: phq9.severity,
            phq9_answers: phq9Answers,
            gad7_score: gad7.total,
            gad7_severity: gad7.severity,
            gad7_answers: gad7Answers,
            crisis_flag: true,
        });

        return Response.json({
            crisis: true,
            crisisMessage:
                "You indicated thoughts of self-harm. Please contact a crisis line immediately: call or text 988 (US), or go to your nearest emergency room.",
        });
    }

    const response = await client.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
            {
                role: "system",
                content: `You are a compassionate mental health screening assistant.
Analyze questionnaire scores and return ONLY valid JSON — no extra text, no markdown, no code fences.
Never diagnose. Always frame findings as "possible indicators of".
Always recommend professional consultation for moderate or higher scores on either scale.`,
            },
            {
                role: "user",
                content: `PHQ-9 (depression) score: ${phq9.total}/27 — severity: ${phq9.severity}
GAD-7 (anxiety) score: ${gad7.total}/21 — severity: ${gad7.severity}

Return JSON with exactly these fields:
{
  "depression_severity": "${phq9.severity}",
  "depression_score": ${phq9.total},
  "anxiety_severity": "${gad7.severity}",
  "anxiety_score": ${gad7.total},
  "summary": "3-4 sentence plain-language explanation covering both scores and how they relate to each other",
  "possible_indicators": ["list", "of", "possible", "conditions"],
  "recommendations": ["5-7 specific, actionable recommendations addressing both anxiety and depression symptoms"],
  "seek_professional": true or false,
  "crisis": false
}`,
            },
        ],
        temperature: 0.3,
    });

    const raw = response.choices[0].message.content;
    const clean = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const result = JSON.parse(clean);

    // Save this session to the database
    await supabase.from("questionnaire_sessions").insert({
        phq9_score: phq9.total,
        phq9_severity: phq9.severity,
        phq9_answers: phq9Answers,
        gad7_score: gad7.total,
        gad7_severity: gad7.severity,
        gad7_answers: gad7Answers,
        crisis_flag: false,
        ai_summary: result.summary,
        possible_indicators: result.possible_indicators,
        recommendations: result.recommendations,
        seek_professional: result.seek_professional,
    });

    return Response.json(result);
}