// lib/crisis.js
// Crisis detection logic and resource data.
// Kept separate from scores.js because this is safety-critical — never touched lightly.

export const CRISIS_RESOURCES = [
  {
    name: "988 Suicide & Crisis Lifeline",
    contact: "Call or text 988",
    region: "US",
    available: "24/7",
  },
  {
    name: "Crisis Text Line",
    contact: "Text HOME to 741741",
    region: "US, UK, Canada",
    available: "24/7",
  },
  {
    name: "Emergency services",
    contact: "Call 911 (US) or your local emergency number",
    region: "Global",
    available: "24/7",
  },
  {
    name: "International Association for Suicide Prevention",
    contact: "findahelpline.com",
    region: "Global directory",
    available: "Varies by country",
  },
];

export function checkPHQ9Crisis(answers) {
  const q9 = answers[8];
  return q9 !== null && q9 >= 1;
}

export const CRISIS_MESSAGE =
  "Thank you for being honest — that takes courage. What you're feeling matters, and support is available right now. Please reach out to one of the resources below. You don't have to go through this alone.";
