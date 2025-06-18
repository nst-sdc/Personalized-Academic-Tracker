import React, { useState } from "react";
import "./Signup.css";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link } from 'react-router-dom';


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

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        // Add your backend submission logic here
    };

    return (
        <div className="singnin-body">
        <div className="signup-container">
            <form className="signup-card" onSubmit={handleSubmit}>
                <h2 className="signup-title">Sign Up</h2>
                <p className="signup-subtitle">Create an account to continue!</p>

                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="dob"
                    placeholder="DD/MM/YYYY"
                    value={formData.dob}
                    onChange={handleChange}
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
                    <div className="separator" />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                {/* Password */}
                <div className="password-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="toggle-password" onClick={togglePassword}>
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                </div>


                <button type="submit" className="register-button">Register</button>
                <p className="login-link">
                    Already have an account? <Link to="/signin">Login</Link>
                </p>

            </form>
        </div>
        </div>
    );
};

export default Signup;
