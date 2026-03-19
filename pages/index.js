import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// ✅ FULL QUESTIONS (FIXED)
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
    "Are operations efficient with minimal delays?",
    "Is there a quality control system?",
    "Are improvements reviewed regularly?"
  ],
  Finance: [
    "Are financial records accurate and updated?",
    "Is there a budgeting process?",
    "Are key metrics tracked?",
    "Is the business financially sustainable?",
    "Are decisions based on financial data?"
  ],
  Customers: [
    "Is target market clearly defined?",
    "Are customer needs assessed?",
    "Is there a complaint handling system?",
    "Is satisfaction measured?",
    "Are retention strategies in place?"
  ],
  Technology: [
    "Are tools supporting operations effectively?",
    "Is automation used where possible?",
    "Is data stored securely?",
    "Are employees trained on systems?",
    "Is technology regularly updated?"
  ]
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [screen, setScreen] = useState("dashboard");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // ✅ FIXED SESSION HANDLING
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ LOGIN FIXED
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) alert(error.message);
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) alert(error.message);
    else alert("Signup successful. You can now login.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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
    return "Focus on growth and automation.";
  };

  // 🔐 LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ padding: 30 }}>
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button onClick={handleLogin}>Login</button>
        <button onClick={handleSignup} style={{ marginLeft: 10 }}>
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      fontFamily: "Arial"
    }}>

      {/* SIDEBAR */}
      <div style={{
        width: isMobile ? "100%" : 220,
        height: isMobile ? "auto" : "100vh",
        background: "#111",
        color: "#fff",
        padding: 20
      }}>
        <h2>📊 SaaS</h2>

        <p onClick={() => setScreen("dashboard")}>Dashboard</p>
        <p onClick={() => setScreen("assessment")}>Assessment</p>
        <p onClick={() => setScreen("results")}>Results</p>
        <p onClick={() => setScreen("recommendations")}>Recommendations</p>

        <br />
        <button onClick={handleLogout}>Logout</button>
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
            <h3>{getPerformanceLevel(calculateScore())}</h3>
          </>
        )}

        {screen === "recommendations" && (
          <>
            <h2>Recommendations</h2>
            <p>{getRecommendation(calculateScore())}</p>
          </>
        )}

      </div>
    </div>
  );
}
