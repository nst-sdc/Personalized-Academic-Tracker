import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { AiOutlineConsoleSql } from "react-icons/ai";

const Signup = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    countryCode: "+91",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (message.text) setMessage({ type: "", text: "" });
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const validateForm = () => {
    const { firstName, lastName, email, dob, phone, password } = formData;

    if (!firstName.trim() || firstName.trim().length < 2)
      return setMessage({ type: "error", text: "First name must be at least 2 characters long" }), false;

    if (!lastName.trim() || lastName.trim().length < 2)
      return setMessage({ type: "error", text: "Last name must be at least 2 characters long" }), false;

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setMessage({ type: "error", text: "Please enter a valid email address" }), false;

    if (!dob) return setMessage({ type: "error", text: "Date of birth is required" }), false;

    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 13) return setMessage({ type: "error", text: "You must be at least 13 years old to sign up" }), false;

    if (!/^[0-9]{10,15}$/.test(phone.replace(/\s+/g, "")))
      return setMessage({ type: "error", text: "Please enter a valid phone number (10–15 digits)" }), false;

    if (password.length < 8)
      return setMessage({ type: "error", text: "Password must be at least 8 characters long" }), false;

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password))
      return setMessage({ type: "error", text: "Password must include uppercase, lowercase, number, and special character" }), false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setMessage({ type: "", text: "" });

    console.log(formData);

    try {
      await new Promise((res) => setTimeout(res, 1500));
      setMessage({
        type: "success",
        text: "Account created successfully! Please check your email for verification.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        countryCode: "+91",
        phone: "",
        password: "",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-2 sm:p-4 transition-colors duration-300 ${
        darkMode
          ? "bg-[#18181b] text-white"
          : "bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 text-black"
      }`}
    >
      <div className={`w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 w-full min-h-64 sm-block">
            <img
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Academic Tracker"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:w-1/2 p-4 sm:p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Create Your Tracker Account</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  Start organizing your academic journey today.
                </p>
              </div>

              {message.text && (
                <div className={`p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-center border text-xs sm:text-sm ${
                  message.type === "success"
                    ? darkMode
                      ? "bg-green-900 text-green-200 border-green-700"
                      : "bg-green-50 text-green-700 border-green-200"
                    : darkMode
                      ? "bg-red-900 text-red-200 border-red-700"
                      : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* First & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {["firstName", "lastName"].map((name, i) => (
                    <div className="relative" key={name}>
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name={name}
                        placeholder={i === 0 ? "First Name" : "Last Name"}
                        value={formData[name]}
                        onChange={handleChange}
                        disabled={loading}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border text-sm sm:text-base ${
                          darkMode ? "bg-black text-white placeholder-gray-400 border-gray-600" : "bg-white text-black border-gray-300"
                        }`}
                      />
                    </div>
                  ))}
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border text-sm sm:text-base ${
                      darkMode ? "bg-black text-white placeholder-gray-400 border-gray-600" : "bg-white text-black border-gray-300"
                    }`}
                  />
                </div>

                {/* DOB */}
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border text-sm sm:text-base ${
                      darkMode ? "bg-black text-white placeholder-gray-400 border-gray-600" : "bg-white text-black border-gray-300"
                    }`}
                  />
                </div>

                {/* Phone */}
                <div className="flex">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    disabled={loading}
                    className={`pl-2 sm:pl-3 pr-1 sm:pr-2 py-3 border rounded-l-lg text-xs sm:text-sm ${
                      darkMode ? "bg-black text-white border-gray-600" : "bg-gray-50 text-black border-gray-300"
                    }`}
                  >
                    <option value="+91">🇮🇳 +91</option>
                  </select>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    className={`flex-1 px-3 sm:px-4 py-3 border border-l-0 rounded-r-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                      darkMode ? "bg-black text-white placeholder-gray-400 border-gray-600" : "bg-white text-black border-gray-300"
                    }`}
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 border text-sm sm:text-base ${
                      darkMode ? "bg-black text-white placeholder-gray-400 border-gray-600" : "bg-white text-black border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm sm:text-base">Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center mt-4 sm:mt-6">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                    Already have an account?
                    <Link to="/signin" className="text-blue-600 hover:text-blue-800 font-semibold ml-1">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;