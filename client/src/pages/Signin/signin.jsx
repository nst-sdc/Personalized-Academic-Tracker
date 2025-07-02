import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import googleIcon from '../../assets/google.svg';
import facebookIcon from '../../assets/facebook.svg';
import appleIcon from '../../assets/apple.svg';
import mobileIcon from '../../assets/mobile.svg';

const Signin = ({ darkMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('userEmail');
    const wasRemembered = localStorage.getItem('rememberMe');
    if (rememberedEmail && wasRemembered === 'true') {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
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
  // Enhanced handleLogin function for Signin.jsx - Add this to handle unverified emails

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
          } else if (data.expiresIn.includes('h')) {
            const hours = parseInt(data.expiresIn.replace('h', ''));
            expiryTime.setHours(expiryTime.getHours() + hours);
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
        // Handle specific error cases
        if (data.code === 'EMAIL_NOT_VERIFIED') {
          setError(`${data.message} Would you like us to resend the verification email?`);
          // Optionally show a "Resend Email" button here
        } else {
          setError(data.message || 'Login failed. Please try again.');
        }
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

  const togglePassword = () => setShowPassword(prev => !prev);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-2 sm:p-4 transition-colors duration-300 ${darkMode
          ? "bg-[#18181b] text-white"
          : "bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 text-black"
        }`}
    >
      <div
        className={`w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300 ${darkMode ? "bg-black text-white" : "bg-white text-black"
          } flex flex-col lg:flex-row`}
      >
        {/* Left Image Section */}
        <div className="lg:w-1/2 w-full sm-block bg-gradient-to-br from-blue-600 via-sky-600 to-indigo-700 p-4 sm:p-8 lg:p-12 flex flex-col justify-center items-center text-white relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center">
            <img
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Illustration"
              className="w-40 h-40 sm:w-64 sm:h-64 object-contain mx-auto mb-4 sm:mb-6"
            />
            <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Welcome Back!</h2>
            <p className="text-blue-100 text-base sm:text-lg">
              Stay organized with your academic goals. Sign in and track your success!
            </p>
          </div>
        </div>

        {/* Right Side Form Section */}
        <div className="lg:w-1/2 w-full p-4 sm:p-8 lg:p-12 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Sign In</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Enter your credentials to access your tracker
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-700 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-center text-xs sm:text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border text-sm sm:text-base ${darkMode
                      ? "bg-black text-white placeholder-gray-400 border-gray-600"
                      : "bg-white text-black border-gray-300"
                    }`}
                />
              </div>

              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border text-sm sm:text-base ${darkMode
                      ? "bg-black text-white placeholder-gray-400 border-gray-600"
                      : "bg-white text-black border-gray-300"
                    }`}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 gap-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <span>Remember Me</span>
                </label>
                <Link to="/forgot-password" className="text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Don’t have an account?
              <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-semibold ml-1">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
