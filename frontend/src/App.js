import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    const res = await axios.post("http://localhost:5000/api/analyze", { idea });
    setResult(res.data);
    setIdea("");
    setLoading(false);
    fetchHistory();
  };

  const fetchHistory = async () => {
    const res = await axios.get("http://localhost:5000/api/history");
    setHistory(res.data);
  };

  const loadFromHistory = (item) => {
    setResult(item);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={styles.container}>

      {/* 🔹 Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={{ marginBottom: "20px" }}>🧠 History</h2>

        {history.map((h) => (
          <div
            key={h._id}
            style={styles.historyItem}
            onClick={() => loadFromHistory(h)}
          >
            <p style={{ fontWeight: "bold" }}>
              {h.idea.slice(0, 40)}...
            </p>
            <span style={{ fontSize: "12px", color: "#aaa" }}>
              Score: {h.clarity_score}
            </span>
          </div>
        ))}
      </div>

      {/* 🔹 Main Content */}
      <div style={styles.main}>

        <h1>🚀 Explain My Plan</h1>

        {/* Input */}
        <div style={styles.inputBox}>
          <textarea
            rows="3"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Type your idea..."
            style={styles.textarea}
          />
          <button onClick={analyze} style={styles.button}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {/* Output */}
        {result && (
          <div style={styles.output}>

            <Section title="🎯 Goal" content={result.goal} />
            <Section title="⚙️ Method" content={result.method} />

            <ListSection title="📋 Steps" items={result.steps} />
            <Section title="⏳ Timeline" content={result.timeline} />

            <ListSection title="⚠️ Missing Elements" items={result.missing_elements} />

            <Section title="✨ Simplified" content={result.simplified} />
            <ListSection title="🚀 Action Steps" items={result.action_steps} />

            <div style={styles.score}>
              📊 Clarity Score: {result.clarity_score}/100
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

/* 🔹 Reusable Components */
const Section = ({ title, content }) => (
  <div style={styles.card}>
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
);

const ListSection = ({ title, items }) => (
  <div style={styles.card}>
    <h3>{title}</h3>
    <ul>
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  </div>
);

/* 🔥 STYLES */
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#343541",
    color: "white",
    fontFamily: "Arial"
  },

  sidebar: {
    width: "250px",
    background: "#202123",
    padding: "15px",
    overflowY: "auto"
  },

  historyItem: {
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
    background: "#2a2b32",
    cursor: "pointer"
  },

  main: {
    flex: 1,
    padding: "20px",
    overflowY: "auto"
  },

  inputBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },

  textarea: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none"
  },

  button: {
    padding: "10px 20px",
    background: "#10a37f",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer"
  },

  output: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  card: {
    background: "#444654",
    padding: "15px",
    borderRadius: "10px"
  },

  score: {
    padding: "15px",
    background: "#10a37f",
    borderRadius: "10px",
    fontWeight: "bold"
  }
};

export default App;