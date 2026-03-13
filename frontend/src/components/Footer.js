import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{
    background: 'var(--ink)',
    color: 'rgba(255,255,255,0.45)',
    padding: '56px 0 28px',
    marginTop: '0',
    borderTop: '1px solid rgba(255,255,255,0.06)'
  }}>
    <div className="container">
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr repeat(3, 1fr)',
        gap: '48px',
        marginBottom: '48px'
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem',
            fontWeight: 600,
            color: 'white',
            letterSpacing: '-0.03em',
            marginBottom: '12px'
          }}>
            Hidden<span style={{ color: 'var(--terra-light)' }}>.</span>India
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.7, maxWidth: '240px' }}>
            Discovering the India that most itineraries miss.
          </p>
        </div>

        {[
          { title: 'Platform', links: [['Explore', '/explore'], ['Nearby Services', '/nearby'], ['Atlas AI', '/assistant']] },
          { title: 'Account', links: [['Create Account', '/signup'], ['Sign In', '/login']] },
          { title: 'Regions', links: [['Northeast', '/explore?search=northeast'], ['Himalaya', '/explore?search=himalaya'], ['Deccan', '/explore?search=karnataka'], ['Coastal', '/explore?search=coastal']] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{
              fontSize: '0.68rem', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)', marginBottom: '16px'
            }}>{col.title}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {col.links.map(([label, href]) => (
                <Link key={label} to={href} style={{
                  fontSize: '0.85rem',
                  transition: 'color 0.2s',
                  color: 'rgba(255,255,255,0.45)'
                }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                >{label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <span style={{ fontSize: '0.78rem' }}>© 2024 Hidden India. All rights reserved.</span>
        <span style={{ fontSize: '0.78rem' }}>Responsible tourism. Respect local cultures.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
