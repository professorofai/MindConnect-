// lib/scores.js
// Pure functions — no UI, no API calls. Just math on questionnaire answers.

export function calcPHQ9(answers) {
    // answers: array of 9 values, each 0-3
    const total = answers.reduce((sum, v) => sum + v, 0);

    const severity =
        total <= 4 ? "minimal" :
            total <= 9 ? "mild" :
                total <= 14 ? "moderate" :
                    total <= 19 ? "moderately severe" : "severe";

    // Question 9 asks about self-harm ideation — this is the crisis trigger
    const crisisFlag = answers[8] >= 1;

    return { total, severity, crisisFlag, maxScore: 27 };
}

export function calcGAD7(answers) {
    // answers: array of 7 values, each 0-3
    const total = answers.reduce((sum, v) => sum + v, 0);

    const severity =
        total <= 4 ? "minimal" :
            total <= 9 ? "mild" :
                total <= 14 ? "moderate" : "severe";

    return { total, severity, maxScore: 21 };
}

// Question text — shared between the UI and used for reference
export const PHQ9_QUESTIONS = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure",
    "Trouble concentrating on things like reading or work",
    "Moving or speaking slowly, or being unusually restless",
    "Thoughts that you would be better off dead or hurting yourself",
];

export const GAD7_QUESTIONS = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it's hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen",
];

export const ANSWER_OPTIONS = [
    { label: "Not at all", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half the days", value: 2 },
    { label: "Nearly every day", value: 3 },
];