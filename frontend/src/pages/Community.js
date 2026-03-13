import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMessages, postMessage, getLocation } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Community.css';

const Community = () => {
  const { locationId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [location, setLocation] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await getMessages(locationId);
      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  }, [locationId]);

  useEffect(() => {
    getLocation(locationId)
      .then(res => setLocation(res.data.location))
      .catch(console.error);

    fetchMessages().finally(() => setLoading(false));

    // Poll for new messages every 5 seconds
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => clearInterval(pollRef.current);
  }, [locationId, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      await postMessage({ location_id: locationId, message: input.trim() });
      setInput('');
      await fetchMessages();
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = new Date(msg.timestamp).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="community-page">
      {/* Header */}
      <div className="community-header">
        <Link to={`/destination/${locationId}`} className="back-btn">← Back</Link>
        <div className="community-location-info">
          <div className="location-icon">CH</div>
          <div>
            <h2>{location?.name || 'Community Chat'}</h2>
            <p>{location?.state} • Traveler Chat Room</p>
          </div>
        </div>
        <div className="live-badge">● LIVE</div>
      </div>

      {/* Chat Area */}
      <div className="community-body">
        <div className="messages-area">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-icon">C</div>
              <h3>Start the conversation</h3>
              <p>Start a conversation with fellow travelers exploring {location?.name}</p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dayMessages]) => (
              <div key={date}>
                <div className="date-divider">
                  <span>{formatDate(dayMessages[0].timestamp)}</span>
                </div>
                {dayMessages.map((msg, i) => {
                  const isMe = msg.user_id === user?.id;
                  const showAvatar = i === 0 || dayMessages[i-1]?.user_id !== msg.user_id;
                  return (
                    <div key={msg.id} className={`community-message ${isMe ? 'me' : 'other'}`}>
                      {!isMe && showAvatar && (
                        <div className="msg-avatar">{msg.user_name?.[0]?.toUpperCase()}</div>
                      )}
                      {!isMe && !showAvatar && <div style={{ width: '36px' }}></div>}
                      <div className="msg-content">
                        {!isMe && showAvatar && (
                          <div className="msg-name">{msg.user_name}</div>
                        )}
                        <div className="msg-bubble">
                          {msg.message}
                          <span className="msg-time">{formatTime(msg.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <form className="community-input" onSubmit={handleSend}>
          <div className="user-tag">
            <span>{user?.name?.split(' ')[0]}</span>
          </div>
          <input
            type="text"
            placeholder={`Message travelers at ${location?.name || 'this location'}...`}
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={sending}
            maxLength={500}
          />
          <button type="submit" disabled={!input.trim() || sending}>
            {sending ? '...' : 'Send →'}
          </button>
        </form>
      </div>

      {/* Sidebar */}
      <div className="community-sidebar">
        <div className="sidebar-card">
          <h4>About This Location</h4>
          {location && (
            <>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-mid)', marginBottom: '16px', lineHeight: '1.6' }}>
                {location.description?.substring(0, 200)}...
              </p>
              <div className="sidebar-rating">
                <span>⭐ {Number(location.rating).toFixed(1)}</span>
                <span>{location.review_count} reviews</span>
              </div>
              <Link to={`/destination/${locationId}`} className="sidebar-link">
                View Full Details →
              </Link>
            </>
          )}
        </div>

        <div className="sidebar-card">
          <h4>Community Guidelines</h4>
          <ul className="rules-list">
            <li>Be respectful to fellow travelers</li>
            <li>Share useful travel tips</li>
            <li>No spam or promotional content</li>
            <li>Respect local culture</li>
          </ul>
        </div>

        <div className="sidebar-card">
          <h4>Emergency Numbers</h4>
          <div style={{ fontSize: '0.82rem', color: 'var(--stone)', lineHeight: 2.1 }}>
            <div>Police &mdash; <strong>100</strong></div>
            <div>Ambulance &mdash; <strong>108</strong></div>
            <div>Fire &mdash; <strong>101</strong></div>
            <div>Tourist Helpline &mdash; <strong>1363</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
