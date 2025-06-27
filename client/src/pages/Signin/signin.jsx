import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import googleIcon from '../../assets/google.svg';
import facebookIcon from '../../assets/facebook.svg';
import appleIcon from '../../assets/apple.svg';
import mobileIcon from '../../assets/mobile.svg';
import './Signin.css';

const Signin = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('userEmail');
    const wasRemembered = localStorage.getItem('rememberMe');
    
    if (rememberedEmail && wasRemembered === 'true') {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Handle checkbox change
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  // Validate form
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Store token in localStorage or sessionStorage based on remember me
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', data.token);
        storage.setItem('user', JSON.stringify(data.user));
        
        // Store expiry information
        if (data.expiresIn) {
          const expiryTime = new Date();
          // Parse expiry time (e.g., "7d" -> 7 days from now)
          if (data.expiresIn.includes('d')) {
            const days = parseInt(data.expiresIn.replace('d', ''));
            expiryTime.setDate(expiryTime.getDate() + days);
          }
          storage.setItem('tokenExpiry', expiryTime.toISOString());
        }
        
        // Handle remember me preferences
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userEmail', formData.email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('userEmail');
        }
        
        // Show success message briefly before redirect
        console.log('Login successful:', data.message);
        
        // Redirect to dashboard or home page
        navigate('/dashboard', { replace: true });
        
      } else {
        // Handle API errors
        setError(data.message || 'Login failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else if (error.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle social login (placeholder functions)
  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // TODO: Implement Google OAuth login
    setError('Google login is not available yet. Please use email/password login.');
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login clicked');
    // TODO: Implement Facebook OAuth login
    setError('Facebook login is not available yet. Please use email/password login.');
  };

  const handleAppleLogin = () => {
    console.log('Apple login clicked');
    // TODO: Implement Apple OAuth login
    setError('Apple login is not available yet. Please use email/password login.');
  };

  const handleMobileLogin = () => {
    console.log('Mobile login clicked');
    // TODO: Implement mobile/SMS login
    setError('Mobile login is not available yet. Please use email/password login.');
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="singnin-body">
      <div className="signin-container">
        <div className="signin-card">
          <div className="header">
            <h1>Login</h1>
            <p>Welcome back! Please enter your details</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
            
            <div className="input-group" style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
                disabled={loading}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            
            <div className="password-option">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  disabled={loading}
                />
                Remember Me
              </label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Log In'}
            </button>
          </form>

          <div className="separator">Or login with</div>

          <div className="login-options">
            <button
              className="btn"
              onClick={handleGoogleLogin}
              disabled={loading}
              title="Sign in with Google"
              type="button"
            >
              <img src={googleIcon} alt="Google" width="24" />
            </button>
            <button
              className="btn"
              onClick={handleFacebookLogin}
              disabled={loading}
              title="Sign in with Facebook"
              type="button"
            >
              <img src={facebookIcon} alt="Facebook" width="24" />
            </button>
            <button
              className="btn"
              onClick={handleAppleLogin}
              disabled={loading}
              title="Sign in with Apple"
              type="button"
            >
              <img src={appleIcon} alt="Apple" width="24" />
            </button>
            <button
              className="btn"
              onClick={handleMobileLogin}
              disabled={loading}
              title="Sign in with Mobile"
              type="button"
            >
              <img src={mobileIcon} alt="Mobile" width="24" />
            </button>
          </div>

          <p className="signup-link">
            Don't have an account? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;