import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/api';
import './AIAssistant.css';

const suggestions = [
  'Best hidden places in Rajasthan?',
  'What food should I try in Ziro Valley?',
  'Is Spiti safe for solo travel?',
  'Nearest hospital to Hampi',
  'Best time to visit Majuli Island',
  'Offbeat destinations in Northeast India',
  'Permits needed for Tawang?',
  'Hidden beaches in Karnataka',
];

const Message = ({ msg }) => (
  <div className={`msg-row ${msg.role}`}>
    {msg.role === 'assistant' && <div className="msg-avatar-atlas">A</div>}
    <div className="msg-bubble-wrap">
      {msg.role === 'assistant' && <span className="msg-sender">Atlas</span>}
      <div className="msg-bubble">
        <p dangerouslySetInnerHTML={{
          __html: msg.content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br/>')
        }} />
      </div>
    </div>
    {msg.role === 'user' && <div className="msg-avatar-user" />}
  </div>
);

const AIAssistant = () => {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hello. I'm Atlas — a travel intelligence tool built around India's lesser-known destinations.\n\nI can help with local food, cultural context, safety, permits, nearby services, and finding places worth visiting that most guides skip. What would you like to know?"
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    const newHistory = [...history, { role: 'user', content: userMessage }];
    try {
      const res = await chatWithAI({ message: userMessage, history });
      const aiMsg = { role: 'assistant', content: res.data.reply };
      setMessages(prev => [...prev, aiMsg]);
      setHistory([...newHistory, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection issue. Please try again." }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(); };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: "Hello again. What would you like to know about India's hidden destinations?" }]);
    setHistory([]);
  };

  return (
    <div className="atlas-page">
      <div className="atlas-sidebar">
        <div className="atlas-brand">
          <div className="atlas-logo-mark">A</div>
          <div>
            <div className="atlas-brand-name">Atlas</div>
            <div className="atlas-brand-sub">India Travel Intelligence</div>
          </div>
        </div>

        <div className="atlas-suggest-section">
          <div className="atlas-suggest-label">Suggested questions</div>
          {suggestions.map((s, i) => (
            <button key={i} className="atlas-suggest-btn" onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>

        <button className="atlas-new-btn" onClick={clearChat}>New conversation</button>
      </div>

      <div className="atlas-chat">
        <div className="atlas-chat-header">
          <div className="atlas-status">
            <div className="atlas-online-dot" />
            <span>Atlas is ready</span>
          </div>
          <span className="atlas-powered-tag">Powered by GPT</span>
        </div>

        <div className="atlas-messages">
          {messages.map((msg, i) => <Message key={i} msg={msg} />)}
          {loading && (
            <div className="msg-row assistant">
              <div className="msg-avatar-atlas">A</div>
              <div className="msg-bubble-wrap">
                <span className="msg-sender">Atlas</span>
                <div className="msg-bubble typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form className="atlas-input-form" onSubmit={handleSubmit}>
          <div className="atlas-input-row">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about destinations, food, safety, permits..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={!input.trim() || loading} className="atlas-send-btn">
              {loading ? (
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.03em' }}>...</span>
              ) : (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
          <p className="atlas-disclaimer">Atlas may make mistakes. Verify important travel information locally.</p>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
