import React from 'react';
import googleIcon from '../../assets/google.svg';
import facebookIcon from '../../assets/facebook.svg';
import appleIcon from '../../assets/apple.svg';
import mobileIcon from '../../assets/mobile.svg';
import './Signin.css';
import { Link } from 'react-router-dom';

const Signin = () => {
  const handleLogin = (e) => {
    e.preventDefault();
  };

  return (
    <div className="singnin-body">
      <div className="signin-container">
        <div className="signin-card">
          <div className="header">
            <h1>Login</h1>
          </div>

          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Enter your Email" required />
            <input type="password" placeholder="Enter your password" required />
            <div className="password-option">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="login-button">Log In</button>
          </form>

          <div className="separator">
            <span>Or login with</span>
          </div>

          <div className="login-options">
            <button className="btn"><img src={googleIcon} alt="google" width="24" /></button>
            <button className="btn"><img src={facebookIcon} alt="facebook" width="24" /></button>
            <button className="btn"><img src={appleIcon} alt="apple" width="24" /></button>
            <button className="btn"><img src={mobileIcon} alt="mobile" width="24" /></button>
          </div>

          <p className="signup-link">
            Don't have an account? <Link to="/">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
