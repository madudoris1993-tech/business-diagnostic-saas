import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [view, setView] = useState("dashboard");

  const questions = {
    operations: [
      "Are your operations efficient?",
      "Do you have clear processes?",
      "Is your team productive?",
      "Do you meet deadlines?",
      "Do you use tools/automation?"
    ],
    marketing: [
      "Do you have a marketing strategy?",
      "Are you getting consistent leads?",
      "Do you use social media effectively?",
      "Do you track conversions?",
      "Do you run paid ads?"
    ],
    finance: [
      "Do you track expenses?",
      "Do you have profit visibility?",
      "Do you budget properly?",
      "Do you forecast revenue?",
      "Are your margins healthy?"
    ]
  };

  const [category, setCategory] = useState("operations");

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }

  async function login() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) alert(error.message);
    else alert("Check your email to login");

    setLoading(false);
  }

  async function saveResult(score) {
    if (!user) return;

    await supabase.from("assessments").insert([
      {
        user_id: user.id,
        score,
        category
      }
    ]);
  }

  function answer(value) {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (step < questions[category].length - 1) {
      setStep(step + 1);
    } else {
      const score = newAnswers.reduce((a, b) => a + b, 0);
      saveResult(score);
      setFinished(true);
    }
  }

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>
        <input
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />
        <button onClick={login}>
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{ width: 200, background: "#111", color: "#fff", padding: 20 }}>
        <h2>SaaS</h2>
        <p onClick={() => setView("dashboard")}>Dashboard</p>
        <p onClick={() => setView("assessment")}>Assessment</p>
        <p onClick={() => setView("results")}>Results</p>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 20 }}>
        
        {view === "dashboard" && (
          <>
            <h1>Dashboard</h1>
            <p>Select category:</p>

            <button onClick={() => {
              setCategory("operations");
              setStep(0);
              setAnswers([]);
              setFinished(false);
              setView("assessment");
            }}>Operations</button>

            <button onClick={() => {
              setCategory("marketing");
              setStep(0);
              setAnswers([]);
              setFinished(false);
              setView("assessment");
            }}>Marketing</button>

            <button onClick={() => {
              setCategory("finance");
              setStep(0);
              setAnswers([]);
              setFinished(false);
              setView("assessment");
            }}>Finance</button>
          </>
        )}

        {view === "assessment" && !finished && (
          <>
            <h2>{category.toUpperCase()}</h2>
            <h3>{questions[category][step]}</h3>

            <button onClick={() => answer(1)}>Yes</button>
            <button onClick={() => answer(0)}>No</button>
          </>
        )}

        {finished && (
          <>
            <h2>Assessment Complete</h2>
            <p>Your score: {answers.reduce((a,b)=>a+b,0)}</p>

            <button onClick={() => setView("dashboard")}>
              Back to Dashboard
            </button>
          </>
        )}

        {view === "results" && (
          <>
            <h2>Results (coming next)</h2>
          </>
        )}

      </div>
    </div>
  );
}
