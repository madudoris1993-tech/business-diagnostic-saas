import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const questions = [
    "Do you have clear business goals?",
    "Are your operations efficient?",
    "Do you track financial performance?",
    "Do you have a marketing strategy?",
    "Is your team aligned with goals?",
    "Do you use data for decisions?",
    "Is customer satisfaction high?",
    "Do you have growth plans?"
  ];

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

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email to login");
    }

    setLoading(false);
  }

  async function saveResult(score) {
    if (!user) return;

    await supabase.from("assessments").insert([
      {
        user_id: user.id,
        score: score,
        category: "general"
      }
    ]);
  }

  function answer(value) {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
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

  if (finished) {
    return (
      <div style={{ padding: 20 }}>
        <h2>✅ Assessment Complete</h2>
        <p>Your results have been saved.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Business Assessment</h2>

      <p>{questions[step]}</p>

      <button onClick={() => answer(1)}>Yes</button>
      <button onClick={() => answer(0)}>No</button>
    </div>
  );
            }
