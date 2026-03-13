import React from 'react';

const LoadingScreen = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: 'var(--parchment)',
    flexDirection: 'column', gap: '20px'
  }}>
    <div className="spinner" />
    <p style={{
      fontFamily: 'var(--font-display)',
      fontSize: '0.95rem', color: 'var(--stone)',
      fontStyle: 'italic', letterSpacing: '0.03em'
    }}>Loading Hidden India...</p>
  </div>
);

export default LoadingScreen;
