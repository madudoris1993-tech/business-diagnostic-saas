
}
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
    "Are operations regularly reviewed for improvement opportunities?"
  ],
  Team: [
    "Are roles and responsibilities clearly defined for all employees?",
    "Are employees evaluated based on measurable performance indicators?",
    "Is there a structured onboarding process?",
    "Are training and development programs in place?",
    "Is employee engagement and satisfaction regularly assessed?"
  ],
  Finance: [
    "Are financial records accurate and up to date?",
    "Is there a clear budgeting and forecasting process?",
    "Are key financial metrics tracked regularly?",
    "Is the business financially sustainable (cash flow, profitability)?",
    "Are financial decisions based on data and analysis?"
  ],
  Customers: [
    "Is the target market clearly defined?",
    "Are customer needs regularly assessed?",
    "Is there a system for handling customer complaints?",
    "Are customer satisfaction levels measured?",
    "Are there strategies in place for customer retention?"
  ],
  Technology: [
    "Are appropriate tools and systems used to support operations?",
    "Is there any level of automation in the business?",
    "Are data and records stored securely and efficiently?",
    "Are employees trained to use technology effectively?",
    "Is technology regularly updated to improve efficiency?"
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
      const questions = sections[section];
      questions.forEach(q => {
        total += answers[section]?.[q] || 0;
        max += 5;
      });
    });

    return Math.round((total / max) * 100);
  };

  const getLevel = (score) => {
    if (score <= 40) return "Critical";
    if (score <= 70) return "Moderate";
    return "Strong";
  };

  const currentSection = sectionNames[step];

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Business Diagnostic Assessment</h1>

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
            <button onClick={() => setStep(step + 1)} style={{ marginLeft: 10 }}>
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>Results</h2>
          <h3>Overall Score: {calculateScore()}%</h3>
          <h3>Performance Level: {getLevel(calculateScore())}</h3>

          <button onClick={() => setStep(0)}>Restart</button>
        </>
      )}
    </div>
  );
}
