import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

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
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [screen, setScreen] = useState("dashboard");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) alert(error.message);
    else setUser(data.user);
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) alert(error.message);
    else alert("Check your email to confirm signup");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
    return "Focus on growth, expansion, and automation.";
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

  // 🔥 MAIN APP
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
                <select onChange={(e) =>
                  handleChange(currentSection, q, e.target.value)
                }>
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            ))}

            <button onClick={() => {
              if (step < sectionNames.length - 1) {
                setStep(step + 1);
              } else {
                setScreen("results");
              }
            }}>
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
