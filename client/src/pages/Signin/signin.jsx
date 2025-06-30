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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return setError('Please fill in all fields');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return setError('Enter a valid email address');

    setLoading(true);
    try {
      console.log("Login data:", formData);
      setTimeout(() => {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userEmail', formData.email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('userEmail');
        }
        navigate('/dashboard');
      }, 1500);
    } catch {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => setShowPassword(prev => !prev);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-2 sm:p-4 transition-colors duration-300 ${
        darkMode
          ? "bg-[#18181b] text-white"
          : "bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 text-black"
      }`}
    >
      <div
        className={`w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300 ${
          darkMode ? "bg-black text-white" : "bg-white text-black"
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
                  className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border text-sm sm:text-base ${
                    darkMode
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
                  className={`w-full pl-10 pr-12 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border text-sm sm:text-base ${
                    darkMode
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

            <div className="text-center my-4 sm:my-6 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Or login with</div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
              {[
                { icon: googleIcon, alt: "Google", onClick: () => alert("Google login") },
                { icon: facebookIcon, alt: "Facebook", onClick: () => alert("Facebook login") },
                { icon: appleIcon, alt: "Apple", onClick: () => alert("Apple login") },
                { icon: mobileIcon, alt: "Mobile", onClick: () => alert("Mobile login") },
              ].map(({ icon, alt, onClick }, idx) => (
                <button
                  key={idx}
                  onClick={onClick}
                  disabled={loading}
                  className={`rounded-lg p-2 flex justify-center transition-colors duration-200 ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-black"
                  }`}
                >
                  <img src={icon} alt={alt} className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              ))}
            </div>

            <p className="text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Don’t have an account?
              <Link to="/signup" className="text-blue-600 hover:underline ml-1 font-medium">
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
