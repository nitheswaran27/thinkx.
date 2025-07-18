import React, { useState, useEffect, useRef } from "react";
import ChatBox from "./components/ChatBox";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("thinkx-chat-history");
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("thinkx-chat-history", JSON.stringify(messages));
  }, [messages]);

  // ✅ Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const recentHistory = messages
    .filter((msg) => msg.sender === "user")
    .slice(-10)
    .reverse();

  const clearHistory = () => {
    localStorage.removeItem("thinkx-chat-history");
    setMessages([]);
    setSidebarOpen(false); // ✅ Close sidebar when history is cleared (mobile-friendly)
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          ref={menuButtonRef}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="top-title">
          Think<span>X</span>
        </div>
      </div>

      <div
        className={`sidebar ${sidebarOpen ? "open" : "closed"}`}
        ref={sidebarRef}
      >
        <div className="about-section">
          <details>
            <summary>About</summary>
            <p>
              ThinkX is an AI assistant developed by <strong> <a href="https://my-portfolio-t4da.vercel.app/#hero">Nitheswaran</a> </strong>, a passionate
              software and tech enthusiast. It is designed to help users with productivity,
              learning, and innovation. Version 1.0 © 2025
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
        <div className="copyright">
        © copyright <strong>MyWebsite</strong>. All rights reserved. Designed & developed by <a href="https://my-portfolio-t4da.vercel.app/#hero">Nitheswaran</a>.

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
