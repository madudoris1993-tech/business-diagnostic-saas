import { useState } from "react";

const sections = {
  Strategy: [
    "Does the company have a clearly documented vision and mission?",
    "Are business goals defined and communicated across all levels?",
    "Is there a structured strategic plan (1–3 years)?",
    "Are decisions aligned with long-term objectives?",
    "Is performance regularly reviewed against strategic goals?"
  ],
  Operations: [
    "Are key business processes documented and standardized?",
    "Is there a system for monitoring operational performance?",
    "Are tasks completed efficiently with minimal delays?",
    "Is there a quality control process in place?",
    "Are operations regularly reviewed for improvement?"
  ]
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const sectionNames = Object.keys(sections);

  const handleChange = (section, question, value) => {
    setAnswers({
      ...answers,
      [section]: {
        ...answers[section],
        [question]: Number(value)
      }
    });
  };

  const calculateScore = () => {
    let total = 0;
    let max = 0;

    sectionNames.forEach(section => {
      sections[section].forEach(q => {
        total += answers[section]?.[q] || 0;
        max += 5;
      });
    });

    return Math.round((total / max) * 100);
  };

  const getInsight = (score) => {
    if (score < 40) return "⚠️ Your business needs urgent structural improvements.";
    if (score < 70) return "⚡ Your business is stable but has growth gaps.";
    return "🚀 Your business is strong and scalable!";
  };

  const currentSection = sectionNames[step];

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Business Diagnostic Tool</h1>

      {step < sectionNames.length ? (
        <>
          <h2>{currentSection}</h2>

          {sections[currentSection].map((q, i) => (
            <div key={i} style={{ marginBottom: 15 }}>
              <p>{q}</p>
              <select
                onChange={(e) =>
                  handleChange(currentSection, q, e.target.value)
                }
                value={answers[currentSection]?.[q] || ""}
              >
                <option value="">Select</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Weak</option>
                <option value="3">3 - Average</option>
                <option value="4">4 - Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
          ))}

          <div style={{ marginTop: 20 }}>
            {step > 0 && (
              <button onClick={() => setStep(step - 1)}>Back</button>
            )}
            <button
              onClick={() => setStep(step + 1)}
              style={{ marginLeft: 10 }}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>📊 Your Results</h2>
          <h3>Score: {calculateScore()}%</h3>
          <p>{getInsight(calculateScore())}</p>

          <button onClick={() => setStep(0)}>Restart</button>
        </>
      )}
    </div>
  );
}
