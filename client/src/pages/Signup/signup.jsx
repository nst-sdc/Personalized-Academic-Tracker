import React, { useState } from "react";
import "./Signup.css";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        countryCode: "+91",
        phone: "",
        password: "",
    });

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        
        // Clear any previous messages when user starts typing
        if (message.text) {
            setMessage({ type: '', text: '' });
        }
    };

    const togglePassword = () => {
        setShowPassword(prev => !prev);
    };

    const validateForm = () => {
        const { firstName, lastName, email, dob, phone, password } = formData;
        
        // Basic validation
        if (!firstName.trim() || firstName.trim().length < 2) {
            setMessage({ type: 'error', text: 'First name must be at least 2 characters long' });
            return false;
        }
        
        if (!lastName.trim() || lastName.trim().length < 2) {
            setMessage({ type: 'error', text: 'Last name must be at least 2 characters long' });
            return false;
        }
        
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address' });
            return false;
        }
        
        if (!dob) {
            setMessage({ type: 'error', text: 'Date of birth is required' });
            return false;
        }
        
        // Check age (must be at least 13)
        const today = new Date();
        const birthDate = new Date(dob);
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13) {
            setMessage({ type: 'error', text: 'You must be at least 13 years old to sign up' });
            return false;
        }
        
        if (!phone.trim() || !/^[0-9]{10,15}$/.test(phone.replace(/\s+/g, ''))) {
            setMessage({ type: 'error', text: 'Please enter a valid phone number (10-15 digits)' });
            return false;
        }
        
        if (password.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
            return false;
        }
        
        // Password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(password)) {
            setMessage({ 
                type: 'error', 
                text: 'Password must contain at least one uppercase letter, lowercase letter, number, and special character' 
            });
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        setMessage({ type: '', text: '' });
        
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            if (data.success) {
                setMessage({ type: 'success', text: 'Account created successfully! Please login.' });
                // Reset form
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    dob: "",
                    countryCode: "+91",
                    phone: "",
                    password: "",
                });
                // Optionally redirect to login page after a delay
                setTimeout(() => {
                    navigate('/signin')
                    // Navigate to login page
                    // window.location.href = '/login'; // or use React Router navigation
                }, 2000);
                
            } else {
                setMessage({ type: 'error', text: data.message || 'Registration failed' });
                
                // Handle specific validation errors
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).join(', ');
                    setMessage({ type: 'error', text: errorMessages });
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage({ 
                type: 'error', 
                text: 'Network error. Please check your connection and try again.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="singnin-body">
            <div className="signup-container">
                <form className="signup-card" onSubmit={handleSubmit}>
                    <h2 className="signup-title">Sign Up</h2>
                    <p className="signup-subtitle">Create an account to continue!</p>

                    {/* Display success/error messages */}
                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="dob"
                        placeholder="DD/MM/YYYY"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                    />

                    {/* Phone number */}
                    <div className="phone-group">
                        <select
                            className="country-select"
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                        >
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+41">🇨🇭 +41</option>
                        </select>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="password-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <span className="toggle-password" onClick={togglePassword}>
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>

                    <button 
                        type="submit" 
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                    
                    <p className="login-link">
                        Already have an account? <Link to="/signin">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;