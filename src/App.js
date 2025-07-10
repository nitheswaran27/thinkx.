// 📁 src/App.js
import React, { useState, useEffect } from "react";
import ChatBox from "./components/ChatBox";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Load chat history on mount
  useEffect(() => {
    const saved = localStorage.getItem("thinkx-chat-history");
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed);
    }
  }, []);

  // ✅ Save chat history on change
  useEffect(() => {
    localStorage.setItem("thinkx-chat-history", JSON.stringify(messages));
  }, [messages]);

  const recentHistory = messages
    .filter((msg) => msg.sender === "user")
    .slice(-10)
    .reverse();

  const clearHistory = () => {
    localStorage.removeItem("thinkx-chat-history");
    setMessages([]); // ✅ Also clear local state
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="top-title">Think<span>X</span></div>
      </div>

      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="about-section">
  <details>
    <summary>About</summary>
    <p>
      ThinkX is an AI assistant developed by <strong>Nitheswaran</strong>, a passionate software and tech enthusiast.
      It is designed to help users with productivity, learning, and innovation. Version 1.0 © 2025
    </p>
  </details>
</div>

        <div className="sidebar-section">
          <h4>Recent</h4>
          <ul>
            {recentHistory.length === 0 ? (
              <li style={{ color: "#888", fontStyle: "italic" }}>No history</li>
            ) : (
              recentHistory.map((msg, idx) => (
                <li key={idx}>{msg.text.slice(0, 30)}...</li>
              ))
            )}
          </ul>
          <button className="clear-btn" onClick={clearHistory}>
  <span className="material-symbols-outlined">delete</span> Delete History
</button>

        </div>
      </div>

      <div className={`main-content ${sidebarOpen ? "with-sidebar" : ""}`}>
        <ChatBox
          input={input}
          setInput={setInput}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
}

export default App;
