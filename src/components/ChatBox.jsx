import React, { useEffect, useRef, useState } from "react";
import "./ChatBox.css";
import { generateGeminiReply } from "../api";


function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}

const TypingDots = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % 3);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="typing-effect">
    <span className="typing-text">thinking</span>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="typing-dot"
        style={{
          opacity: active === i ? 1 : 0.2,
          transform: active === i ? "scale(1.5)" : "scale(1)",
          transition: "all 0.3s ease"
        }}
      />
    ))}
  </div>
  
  );
};

const ChatBox = ({ input, setInput, messages, setMessages }) => {
  const [showSuggestions, setShowSuggestions] = useState(messages.length === 0);
  const [showChat, setShowChat] = useState(messages.length > 0);
  const bottomRef = useRef(null);

  const promptSuggestions = [
    "Give me a productivity tip",
    "Give me a motivational quote",
    "Who developed ThinkX",
   
  ];

  useEffect(() => {
    const saved = localStorage.getItem("thinkx-chat-history");
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setMessages(parsed);
        if (parsed.length > 0) setShowChat(true);
      }
    } catch (e) {
      console.error("Invalid chat history", e);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("thinkx-chat-history", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setShowChat(true);
    setShowSuggestions(false);

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg, { sender: "bot", text: "thinking..." }]);
    setInput("");

    try {
      const reply = await generateGeminiReply(input);
      let index = 0;
      let currentText = "";

      const typeMessage = () => {
        if (index < reply.length) {
          currentText += reply[index];
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { sender: "bot", text: currentText }
          ]);
          index++;
          setTimeout(typeMessage, 15);
        }
      };

      typeMessage();
    } catch (err) {
      setMessages((prev) => [...prev.slice(0, -1), { sender: "bot", text: "❌ Failed to fetch reply." }]);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      {!showChat && showSuggestions && (
        <div className="center-welcome-message">
          <h2>Welcome to ThinkX</h2>
          <p>How can I help you today?</p>
        </div>
      )}

      {showChat && (
        <div className="chat-window">
          {messages.map((msg, idx) =>
            msg.text === "thinking..." ? (
              <div key={idx} className="msg-bubble bot">
                <TypingDots />
              </div>
            ) : (
              <div key={idx} className={`msg-bubble ${msg.sender}`}>
                <span dangerouslySetInnerHTML={{ __html: linkify(msg.text) }} />
              </div>
            )
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {showSuggestions && (
        <div className="prompt-suggestions">
          {promptSuggestions.map((prompt, index) => (
            <button
              key={index}
              onClick={() => {
                setInput(prompt);
                setShowSuggestions(false);
                setShowChat(true);
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input-row">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(e.target.value.trim() === "");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask ThinkX anything..."
        />
        <button onClick={handleSend} className="send-btn">➤</button>
      </div>
    </div>
  );
};

export default ChatBox;
