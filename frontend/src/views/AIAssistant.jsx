import React, { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "../styles/AIAssistant.module.css";

const AIAssistant = ({ userRunData }) => {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm Chase, your AI running coach. I can help you plan future races, create training schedules, and track your progress toward visiting all 50 states. What would you like to work on today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestions = [
    "Plan a 4-month marathon schedule in Southern California",
    "Create a training plan for my first 5K",
    "Suggest races in states I haven't visited yet",
    "What's a good race in Texas this spring?",
    "Help me plan to visit all 50 states",
  ];

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);
    setShowSuggestions(false);

    console.log("=== FRONTEND DEBUG ===");
    console.log("1. Is user authenticated?", isAuthenticated);

    try {
      console.log("2. Getting access token...");
      const token = await getAccessTokenSilently();
      console.log("3. Token received:", !!token);
      console.log("4. Token length:", token?.length);
      console.log("5. Token preview:", token?.substring(0, 30) + "...");

      // NEW: Include conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      // Add the current message
      conversationHistory.push({
        role: "user",
        content: currentInput,
      });

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      console.log("6. Headers:", headers);
      console.log("7. Sending request to: http://localhost:3000/api/ai/chat");

      const response = await fetch("http://localhost:3000/api/ai/chat", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          message: currentInput,
          userRunData: userRunData,
          conversationHistory: conversationHistory,
        }),
      });

      console.log("8. Response status:", response.status);
      console.log("9. Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("10. Error response:", errorData);
        throw new Error(
          `Server responded with ${response.status}: ${errorData}`
        );
      }

      const data = await response.json();
      console.log("11. Success! Got response");

      if (data.success) {
        setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
      }
    } catch (error) {
      console.error("=== ERROR ===");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Full error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Error: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>🏃‍♂️ AI Running Coach</h2>
        <p className={styles.subtitle}>
          Plan races • Get advice • Track progress
        </p>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles[msg.role]}`}>
            <div className={styles.messageContent}>
              <strong>{msg.role === "user" ? "You" : "🤖 Coach Chase"}:</strong>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className={`${styles.message} ${styles.ai}`}>
            <div className={styles.messageContent}>
              <strong>🤖 Coach:</strong>
              <p className={styles.typing}>Planning your races...</p>
            </div>
          </div>
        )}

        {showSuggestions && messages.length === 1 && (
          <div className={styles.suggestionsContainer}>
            <p className={styles.suggestionsTitle}>Try asking:</p>
            <div className={styles.suggestions}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={styles.suggestionButton}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me to plan races, create schedules, or suggest routes..."
          className={styles.input}
          disabled={loading}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={loading || !input.trim()}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>

      {userRunData && userRunData.totalRuns > 0 && (
        <div className={styles.statsFooter}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{userRunData.totalRuns}</span>
            <span className={styles.statLabel}>Runs</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{userRunData.totalStates}</span>
            <span className={styles.statLabel}>States</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>
              {50 - userRunData.totalStates}
            </span>
            <span className={styles.statLabel}>To Go</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
