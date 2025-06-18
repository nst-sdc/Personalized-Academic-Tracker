import React from 'react';
import googleIcon from '../../assets/google.svg';
import facebookIcon from '../../assets/facebook.svg';
import appleIcon from '../../assets/apple.svg';
import mobileIcon from '../../assets/mobile.svg';
import './Signin.css';

const Signin = () => {
  const handleLogin = (e) => {
    e.preventDefault();
  };

  return (
    <div className="input-box">
      <div className="header">
        <h1>Login</h1>
        <p>Enter your email and password to log in</p>
      </div>

      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Enter your Email" className="input-field" required />
        <br />
        <input type="password" placeholder="Enter your password" className="input-field" required />
        <div className="password-option">
          <label>
            <input type="checkbox" /> Remember Me
          </label>
          <a href="#">Forgot password?</a>
        </div>
        <button type="submit" className="login-button">Log In</button>
      </form>

      <div className="separator">Or login with</div>

      <div className="login-options">
        <button className="btn"><img src={googleIcon} alt="google" width="24" /></button>
        <button className="btn"><img src={facebookIcon} alt="facebook" width="24" /></button>
        <button className="btn"><img src={appleIcon} alt="apple" width="24" /></button>
        <button className="btn"><img src={mobileIcon} alt="mobile" width="24" /></button>
      </div>
    </div>
  );
};

export default Signin;
