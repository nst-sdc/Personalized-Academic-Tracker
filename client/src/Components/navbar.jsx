import React, { useState } from 'react';
import './Navbar.css';
import { FiHome } from "react-icons/fi";
import { CiClock2 } from "react-icons/ci";
import { LuClock } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <nav className={`navbar${darkMode ? ' navbar-dark' : ''}`}>
      <div className="nav-left">
        <div className="logo">
          <span>Logo</span>
        </div>
        <ul className="nav-menu">
          <li className="active"> <FiHome /> Home</li>
          <li><CiClock2/> Analysis </li>
          <li><LuClock/> History  </li>
          <li><CgProfile/> Profile  </li>
        </ul>
      </div>
      <div className="nav-right">
        <span
          className="theme-toggle"
          onClick={() => setDarkMode((prev) => !prev)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? '☾' : '☀︎'}
        </span>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Labrador_Retriever_portrait.jpg/1200px-Labrador_Retriever_portrait.jpg"
          alt="User"
          className="profile-img"
        />
        <span className="dropdown-icon">▾</span>
      </div>
    </nav>
  );
}

export default Navbar;