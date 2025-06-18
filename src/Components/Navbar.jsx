import React, { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <nav className={`navbar${darkMode ? ' navbar-dark' : ''}`}>
      <div className="nav-left">
        <div className="logo">
          <span>Logo</span>
        </div>
        <ul className="nav-menu">
          <li className="active">Home</li>
          <li>Analysis</li>
          <li>History</li>
          <li>Profile</li>
        </ul>
      </div>
      <div className="nav-right">
        <span
          className="theme-toggle"
          onClick={() => setDarkMode((prev) => !prev)}
          style={{
            fontSize: '1.6rem',
            cursor: 'pointer',
            marginRight: '36px',
            transition: 'transform 0.2s',
          }}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? '☾' : '☀︎'}
        </span>
        <img
          src="https://via.placeholder.com/40"
          alt="User"
          className="profile-img"
        />
        <span className="dropdown-icon">▾</span>
      </div>
    </nav>
  );
}

export default Navbar;