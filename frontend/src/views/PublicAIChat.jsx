import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/PublicAIChat.module.css';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
const MAX_FREE_MESSAGES = 3;

const formatMessage = (text) => {
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
  
  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
};

const PublicAIChat = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! I'm Coach Chase. Ask me anything about running races across the US — no account needed. What are you curious about?",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "What marathons are coming up in California?",
    "What's the difference between a half and full marathon?",
    "Good 5K races for beginners?",
    "Best races in Texas this fall?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    const newCount = userMessageCount + 1;
    setUserMessageCount(newCount);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      const response = await fetch(`${API_URL}/public-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory,
        }),
      });
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);


      const data = await response.json();
      console.log(data, 'data')

      if (data.success) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      }
    } catch (err) {
      const isOverloaded = err.message?.includes('UNAVAILABLE') || err.message?.includes('503');
      setMessages(prev => [...prev, {
        role: 'ai',
        text: isOverloaded 
          ? "I'm a bit overloaded right now! Please try asking again in a moment."
          : 'Something went wrong. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const showUpsell = userMessageCount >= MAX_FREE_MESSAGES;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              <i className="ti ti-robot" aria-hidden="true" />
            </div>
            <div>
              <div className={styles.headerTitle}>🤖 Coach Chase</div>
              <div className={styles.headerSub}>General race assistant · No account needed</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.map((msg, i) => (
            <div key={i} className={`${styles.message} ${styles[msg.role]}`}>
              {msg.role === 'ai' && (
                <div className={styles.messageName}>Coach Chase</div>
              )}
              <p className={styles.messageText}>{formatMessage(msg.text)}</p>
            </div>
          ))}

          {/* Suggestion chips — show only at start */}
          {messages.length === 1 && (
            <div className={styles.suggestions}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  className={styles.suggestionBtn}
                  onClick={() => setInput(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className={`${styles.message} ${styles.ai}`}>
              <div className={styles.messageName}>Coach Chase</div>
              <p className={styles.messageText} style={{ color: '#888', fontStyle: 'italic' }}>
                Finding races...
              </p>
            </div>
          )}

          {/* Upsell after 3 messages */}
          {showUpsell && (
            <div className={styles.upsell}>
              <div className={styles.upsellText}>
                Want a personalized training plan and race tracker?
              </div>
              <div className={styles.upsellButtons}>
                <a href="/signup" className={styles.upsellPrimary}>Sign up free</a>
                <a href="/login" className={styles.upsellSecondary}>Log in</a>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className={styles.inputRow}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about races, training, distances..."
            className={styles.input}
            disabled={loading}
          />
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicAIChat;