import { useState, useEffect } from "react";

const sections = {
  Strategy: [
    "Does the company have a clearly documented vision and mission?",
    "Are business goals defined across all levels?",
    "Is there a structured strategic plan (1–3 years)?",
    "Are decisions aligned with long-term objectives?",
    "Is performance reviewed against strategy?"
  ],
  Operations: [
    "Are processes documented and standardized?",
    "Is performance monitored regularly?",
    "Are operations efficient?",
    "Is there a quality control system?",
    "Are improvements reviewed regularly?"
  ]
};

export default function Home() {
  const [screen, setScreen] = useState("dashboard");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      fontFamily: "Arial"
    }}>

      {/* SIDEBAR */}
      <div style={{
        width: isMobile ? "100%" : 220,
        background: "#111",
        color: "#fff",
        padding: 20
      }}>
        <h2>📊 SaaS</h2>
        <p onClick={() => setScreen("dashboard")}>Dashboard</p>
        <p onClick={() => setScreen("assessment")}>Assessment</p>
        <p onClick={() => setScreen("results")}>Results</p>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 20 }}>

        {screen === "dashboard" && (
          <>
            <h1>Welcome</h1>
            <p>Select a section</p>
          </>
        )}

        {screen === "assessment" && (
          <>
            <h2>{currentSection}</h2>

            {sections[currentSection].map((q, i) => (
              <div key={i}>
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

            <br />

            <button onClick={() => setStep(Math.max(step - 1, 0))}>
              Back
            </button>

            <button
              onClick={() => {
                if (step < sectionNames.length - 1) {
                  setStep(step + 1);
                } else {
                  setScreen("results");
                }
              }}
              style={{ marginLeft: 10 }}
            >
              Next
            </button>
          </>
        )}

        {screen === "results" && (
          <>
            <h2>Results</h2>
            <h3>{calculateScore()}%</h3>
          </>
        )}

      </div>
    </div>
  );
}
