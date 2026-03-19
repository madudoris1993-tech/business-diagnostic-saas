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

    return max === 0 ? 0 : Math.round((total / max) * 100);
  };

  const getPerformanceLevel = (score) => {
    if (score < 40) return "Critical";
    if (score < 70) return "Moderate";
    return "Strong";
  };

  const getRecommendation = (score) => {
    if (score < 40) return "Improve structure, processes, and leadership.";
    if (score < 70) return "Optimize operations and scale gradually.";
    return "Focus on growth, expansion, and automation.";
  };

  return (
    <div style={{ display: "flex", fontFamily: "Arial" }}>

      {/* SIDEBAR */}
      <div style={{
        width: 220,
        height: "100vh",
        background: "#111",
        color: "#fff",
        padding: 20
      }}>
        <h2>📊 SaaS</h2>

        <p style={{ cursor: "pointer" }} onClick={() => setScreen("dashboard")}>
          Dashboard
        </p>

        <p style={{ cursor: "pointer" }} onClick={() => setScreen("assessment")}>
          Assessment
        </p>

        <p style={{ cursor: "pointer" }} onClick={() => setScreen("results")}>
          Results
        </p>

        <p style={{ cursor: "pointer" }} onClick={() => setScreen("recommendations")}>
          Recommendations
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: 30 }}>

        {/* DASHBOARD */}
        {screen === "dashboard" && (
          <>
            <h1>Welcome to your Dashboard</h1>
            <p>Select a section from the left menu</p>
          </>
        )}

        {/* ASSESSMENT */}
        {screen === "assessment" && (
          <>
            <h2>{currentSection}</h2>

            {sections[currentSection].map((q, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <p>{q}</p>
                <select
                  value={answers[currentSection]?.[q] || ""}
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

            <div style={{ marginTop: 20 }}>
              {step > 0 && (
                <button onClick={() => setStep(step - 1)}>
                  Back
                </button>
              )}

              <button
                style={{ marginLeft: 10 }}
                onClick={() => {
                  if (step < sectionNames.length - 1) {
                    setStep(step + 1);
                  } else {
                    setScreen("results");
                  }
                }}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* RESULTS */}
        {screen === "results" && (
          <>
            <h2>📊 Results</h2>
            <h3>Score: {calculateScore()}%</h3>
            <h3>Performance: {getPerformanceLevel(calculateScore())}</h3>

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
    </div>
  );
}
