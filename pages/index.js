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
    "Systems updated regularly?"
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

  // ✅ AUTH STATE
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ✅ LOGIN
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
    else alert("Signup successful. You can now login.");
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // ✅ HANDLE ANSWERS
  const handleChange = (section, question, value) => {
    setAnswers({
      ...answers,
      [section]: {
        ...answers[section],
        [question]: Number(value)
      }
    });
  };

  // ✅ SCORE
  const calculateScore = () => {
    let total = 0;
    let max = 0;

    sectionNames.forEach(section => {
      sections[section].forEach(q => {
        total += answers[section]?.[q] || 0;
        max += 5;
      });
    });

    const finalScore = max === 0 ? 0 : Math.round((total / max) * 100);
    setScore(finalScore);
    return finalScore;
  };

  // ✅ SAVE RESULT
  const saveResult = async () => {
    const finalScore = calculateScore();

    const { error } = await supabase.from("results").insert([
      {
        user_id: user.id,
        score: finalScore
      }
    ]);

    if (error) {
      alert("Error saving result");
    } else {
      alert("Result saved!");
    }
  };

  // 🔐 LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ padding: 30 }}>
        <h2>Login</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button onClick={login}>Login</button>
        <button onClick={signup} style={{ marginLeft: 10 }}>
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial" }}>

      {/* NAVBAR */}
      <div style={{ background: "#111", color: "#fff", padding: 15 }}>
        <span style={{ marginRight: 15, cursor: "pointer" }} onClick={() => setScreen("dashboard")}>
          Dashboard
        </span>

        <span style={{ marginRight: 15, cursor: "pointer" }} onClick={() => setScreen("assessment")}>
          Assessment
        </span>

        <span style={{ marginRight: 15, cursor: "pointer" }} onClick={() => setScreen("results")}>
          Results
        </span>

        <span style={{ marginRight: 15, cursor: "pointer" }} onClick={() => setScreen("recommendations")}>
          Recommendations
        </span>

        <button onClick={logout} style={{ float: "right" }}>
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: 20 }}>

        {screen === "dashboard" && (
          <>
            <h1>Welcome to your Dashboard</h1>
            <p>Select a section above</p>
          </>
        )}

        {screen === "assessment" && (
          <>
            <h2>{currentSection}</h2>

            {sections[currentSection].map((q, i) => (
              <div key={i} style={{ marginBottom: 15 }}>
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
            <h3>Score: {calculateScore()}%</h3>
            <button onClick={saveResult}>Save Result</button>
          </>
        )}

        {screen === "recommendations" && (
          <>
            <h2>Recommendations</h2>
            <p>
              {score < 40 && "Improve structure and processes."}
              {score >= 40 && score < 70 && "Optimize operations and scale."}
              {score >= 70 && "Focus on growth and expansion."}
            </p>
          </>
        )}

      </div>
    </div>
  );
}
