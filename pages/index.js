import { useState } from "react";

const sections = {
  Strategy: [
    "Does the company have a clearly documented vision and mission?",
    "Are business goals defined across all levels?",
    "Is there a structured strategic plan?"
  ],
  Operations: [
    "Are processes documented?",
    "Is performance monitored?",
    "Is there quality control?"
  ]
};

export default function Home() {
  const [screen, setScreen] = useState("dashboard");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const sectionNames = Object.keys(sections);
  const currentSection = sectionNames[step];

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

  const getRecommendation = (score) => {
    if (score < 40) return "Improve structure, processes, and leadership.";
    if (score < 70) return "Optimize operations and scale gradually.";
    return "Focus on growth, expansion, and automation.";
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      
      {/* DASHBOARD */}
      {screen === "dashboard" && (
        <>
          <h1>📊 Business Dashboard</h1>

          <button onClick={() => setScreen("assessment")}>
            Start Assessment
          </button>

          <br /><br />

          <button onClick={() => setScreen("results")}>
            View Results
          </button>

          <br /><br />

          <button onClick={() => setScreen("recommendations")}>
            Recommendations
          </button>
        </>
      )}

      {/* ASSESSMENT */}
      {screen === "assessment" && (
        <>
          <h2>{currentSection}</h2>

          {sections[currentSection].map((q, i) => (
            <div key={i}>
              <p>{q}</p>
              <select
                onChange={(e) =>
                  handleChange(currentSection, q, e.target.value)
                }
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

          <br />

          <button onClick={() => setScreen("dashboard")}>Back</button>

          <button
            onClick={() =>
              step < sectionNames.length - 1
                ? setStep(step + 1)
                : setScreen("results")
            }
          >
            Next
          </button>
        </>
      )}

      {/* RESULTS */}
      {screen === "results" && (
        <>
          <h2>📊 Results</h2>
          <h3>Score: {calculateScore()}%</h3>

          <button onClick={() => setScreen("dashboard")}>
            Back to Dashboard
          </button>
        </>
      )}

      {/* RECOMMENDATIONS */}
      {screen === "recommendations" && (
        <>
          <h2>💡 Recommendations</h2>
          <p>{getRecommendation(calculateScore())}</p>

          <button onClick={() => setScreen("dashboard")}>
            Back to Dashboard
          </button>
        </>
      )}
    </div>
  );
}
