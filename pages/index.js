import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const sections = {
  Strategy: [
    "Vision & mission clearly defined?",
    "Goals communicated across levels?",
    "Structured strategic plan?",
    "Decisions aligned long-term?",
    "Performance reviewed regularly?"
  ],
  Operations: [
    "Processes documented?",
    "Performance monitored?",
    "Efficient workflows?",
    "Quality control system?",
    "Continuous improvement?"
  ],
  Finance: [
    "Accurate financial records?",
    "Budgeting system?",
    "Metrics tracked?",
    "Cash flow sustainable?",
    "Data-driven decisions?"
  ],
  Customers: [
    "Target market defined?",
    "Customer needs assessed?",
    "Complaint handling system?",
    "Satisfaction measured?",
    "Retention strategy?"
  ],
  Technology: [
    "Tools support operations?",
    "Automation used?",
    "Secure data storage?",
    "Staff trained on tech?",
    "Systems regularly updated?"
  ]
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [screen, setScreen] = useState("dashboard");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  const sectionNames = Object.keys(sections);
  const currentSection = sectionNames[step];

  // ✅ AUTH FIX
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) alert(error.message);
  };

  const signup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) alert(error.message);
    else alert("Check email to confirm account");
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

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

    const finalScore = Math.round((total / max) * 100);
    setScore(finalScore);
    return finalScore;
  };

  // ✅ SAVE TO DATABASE
  const saveResult = async () => {
    const finalScore = calculateScore();

    await supabase.from("results").insert([
      {
        user_id: user.id,
        score: finalScore
      }
    ]);

    alert("Result saved!");
  };

  // 🔐 LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ padding: 30 }}>
        <h2>Login</h2>

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <br /><br />

        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <br /><br />

        <button onClick={login}>Login</button>
        <button onClick={signup} style={{ marginLeft: 10 }}>Sign Up</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", fontFamily: "Arial" }}>

      {/* NAV */}
      <div style={{ background: "#111", color: "#fff", padding: 15 }}>
        <span onClick={() => setScreen("dashboard")} style={{ marginRight: 15 }}>Dashboard</span>
        <span onClick={() => setScreen("assessment")} style={{ marginRight: 15 }}>Assessment</span>
        <span onClick={() => setScreen("results")} style={{ marginRight: 15 }}>Results</span>
        <span onClick={() => setScreen("recommendations")} style={{ marginRight: 15 }}>Recommendations</span>
        <button onClick={logout} style={{ float: "right" }}>Logout</button>
      </div>

      <div style={{ padding: 20 }}>

        {screen === "dashboard" && (
          <>
            <h1>Dashboard</h1>
            <p>Welcome back 👋</p>
          </>
        )}

        {screen === "assessment" && (
          <>
            <h2>{currentSection}</h2>

            {sections[currentSection].map((q, i) => (
              <div key={i}>
                <p>{q}</p>
                <select onChange={(e) => handleChange(currentSection, q, e.target.value)}>
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

            <button onClick={() => setStep(Math.max(step - 1, 0))}>Back</button>

            <button
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
          </>
        )}

        {screen === "results" && (
          <>
            <h2>Results</h2>
            <h3>{calculateScore()}%</h3>
            <button onClick={saveResult}>Save Result</button>
          </>
        )}

        {screen === "recommendations" && (
          <>
            <h2>Recommendations</h2>
            <p>
              {score < 40 && "Improve structure and processes."}
              {score >= 40 && score < 70 && "Optimize and scale."}
              {score >= 70 && "Focus on growth and expansion."}
            </p>
          </>
        )}

      </div>
    </div>
  );
}
