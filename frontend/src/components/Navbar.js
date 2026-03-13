import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };
  const isHome = location.pathname === '/';

  return (
    <nav className={`navbar ${scrolled || !isHome ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Hidden<span className="logo-dot">.</span>India
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/explore" className={location.pathname === '/explore' ? 'active' : ''}>Explore</Link>
          <Link to="/nearby" className={location.pathname === '/nearby' ? 'active' : ''}>Nearby</Link>
          <Link to="/assistant" className={location.pathname === '/assistant' ? 'active' : ''}>Atlas</Link>

          {user ? (
            <div className="nav-user">
              <span className="nav-user-name">Hello, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="nav-logout">Sign out</button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-login">Sign in</Link>
              <Link to="/signup" className="nav-signup">Join free</Link>
            </div>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
