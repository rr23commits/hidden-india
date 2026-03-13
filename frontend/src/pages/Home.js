import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLocations } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DestinationCard from '../components/DestinationCard';
import './Home.css';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    getLocations({ limit: 6 })
      .then(res => setFeatured(res.data.locations))
      .catch(console.error);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="home">

      {/* Hero */}
      <section className="hero">
        <div className="hero-media">
          <img
            src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1800&q=85&auto=format"
            alt="India landscape"
          />
          <div className="hero-vignette" />
        </div>

        <div className="hero-content container">
          <div className="hero-eyebrow">
            <span className="hero-line" />
            <span>Discover Underrated India</span>
          </div>
          <h1 className="hero-title">
            The places<br />
            <em>no one told you</em><br />
            about
          </h1>
          <p className="hero-sub">
            Tribal valleys, river monasteries, artisan villages — we map the India 
            that most travelers walk right past.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search a destination, state or experience"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div className="hero-pills">
            {['Ziro Valley', 'Spiti', 'Majuli', 'Hampi', 'Mawlynnong'].map(s => (
              <button key={s} className="pill" onClick={() => navigate(`/explore?search=${s}`)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-track"><div className="scroll-thumb" /></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* Intro strip */}
      <section className="intro-strip">
        <div className="container intro-strip-inner">
          <div className="intro-stat">
            <span className="stat-n">10+</span>
            <span className="stat-l">Hidden destinations</span>
          </div>
          <div className="intro-divider" />
          <div className="intro-stat">
            <span className="stat-n">28</span>
            <span className="stat-l">States covered</span>
          </div>
          <div className="intro-divider" />
          <div className="intro-stat">
            <span className="stat-n">AI</span>
            <span className="stat-l">Powered travel guide</span>
          </div>
          <div className="intro-divider" />
          <div className="intro-stat">
            <span className="stat-n">Live</span>
            <span className="stat-l">Traveler community</span>
          </div>
        </div>
      </section>

      {/* Featured destinations */}
      <section className="destinations-section container">
        <div className="section-top">
          <div>
            <span className="section-label">Curated picks</span>
            <h2 className="section-heading">Hidden gems across India</h2>
          </div>
          <Link to="/explore" className="btn-outline">View all</Link>
        </div>
        <div className="destinations-grid">
          {featured.map(dest => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* Member benefits — only shown to logged out users */}
      {!user && (
        <section className="benefits-section">
          <div className="container benefits-inner">
            <div className="benefits-text">
              <span className="section-label">Members get more</span>
              <h2>Your account unlocks the full experience</h2>
              <p>
                Free membership gives you access to features that make travel 
                genuinely better — not just a prettier feed.
              </p>
              <div className="benefits-list">
                {[
                  ['Atlas AI', 'Ask our travel intelligence anything — food, permits, safety, culture — and get answers grounded in real local knowledge.'],
                  ['Traveler Chat', 'Get into location-based rooms and talk directly with people currently exploring the same destination.'],
                  ['Write Reviews', 'Share your experience and help the next traveler make a better decision.'],
                  ['Nearby Services', 'One tap to find hospitals, ATMs, hotels and emergency contacts wherever you are.'],
                ].map(([title, desc]) => (
                  <div key={title} className="benefit-item">
                    <div className="benefit-dot" />
                    <div>
                      <strong>{title}</strong>
                      <p>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="benefits-cta">
                <Link to="/signup" className="btn-primary">Create free account</Link>
                <Link to="/login" className="btn-outline">Sign in</Link>
              </div>
            </div>
            <div className="benefits-visual">
              <img
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80&auto=format"
                alt="Traveler in India"
              />
              <div className="benefits-card-float">
                <div className="bcf-label">Currently exploring</div>
                <div className="bcf-place">Ziro Valley, Arunachal</div>
                <div className="bcf-travelers">14 travelers in chat</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Atlas AI teaser */}
      <section className="atlas-section container">
        <div className="atlas-inner">
          <div className="atlas-left">
            <span className="section-label">AI Travel Intelligence</span>
            <h2>Meet Atlas — your private India expert</h2>
            <p>
              Atlas has absorbed thousands of hours of travel writing, local guides, 
              safety advisories and cultural documentation about India's lesser-known destinations. 
              Ask it anything.
            </p>
            <div className="atlas-queries">
              {[
                'What food should I try in Ziro Valley?',
                'Is Spiti safe to visit in October?',
                'Find hospitals near Hampi',
              ].map(q => (
                <div key={q} className="atlas-query-chip">{q}</div>
              ))}
            </div>
            <Link to={user ? '/assistant' : '/signup'} className="btn-primary">
              {user ? 'Talk to Atlas' : 'Sign up to use Atlas'}
            </Link>
          </div>

          <div className="atlas-chat-preview">
            <div className="acp-header">
              <div className="acp-dot" />
              <span>Atlas</span>
            </div>
            <div className="acp-body">
              <div className="acp-bubble user">What are the best offbeat places near Visakhapatnam?</div>
              <div className="acp-bubble atlas">
                <span className="acp-name">Atlas</span>
                Near Vizag, Etikoppaka stands out — a village famous for 400-year-old lacquer toy craft. 
                Araku Valley is worth a stop for tribal culture and coffee estates. 
                Lambasingi is the only place in Andhra that sees frost, remarkable in the south.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial feature block */}
      <section className="editorial-section">
        <div className="container editorial-inner">
          <div className="editorial-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=80&auto=format"
              alt="India cultural landscape"
            />
          </div>
          <div className="editorial-text">
            <span className="section-label">Our philosophy</span>
            <h2>Tourism that leaves places better than it found them</h2>
            <p>
              Hidden India is built around one idea: India's real richness lies in the places 
              most itineraries skip. We highlight artisan villages, tribal cultures, 
              ancient monasteries and coastlines that haven't been overrun.
            </p>
            <p>
              Every destination profile is written to give you cultural context, not just 
              directions. We believe knowing why a place matters makes the visit mean more.
            </p>
            <Link to="/explore" className="btn-outline">Start exploring</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
