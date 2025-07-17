import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const EmailVerified = () => {
    const { token } = useParams(); // Get token from the URL
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verifying your email, please wait...');

    useEffect(() => {
        // This effect runs once when the component loads
        if (token) {
            const verifyTokenOnBackend = async () => {

                const API_BASE = import.meta.env.VITE_API_URL;
                try {
                    const response = await fetch(`${API_BASE}/api/auth/verify-email`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token }),
                    });

                    const data = await response.json();

                    if (response.ok && data.success) {
                        setStatus('success');
                        setMessage(data.message);
                    } else {
                        setStatus('error');
                        setMessage(data.message || 'Verification failed. The link may be invalid or expired.');
                    }
                } catch (error) {
                    setStatus('error');
                    setMessage('A network error occurred. Please check your connection and try again.');
                    console.error('Verification API error:', error);
                }
            };

            verifyTokenOnBackend();
        } else {
            // Handle case where someone navigates to the page without a token
            setStatus('error');
            setMessage('No verification token provided. Please use the link from your email.');
        }
    }, [token]); // The dependency array ensures this effect runs only when the token from the URL changes

    // Render different UI based on the verification status
    const renderContent = () => {
        switch (status) {
            case 'success':
                return (
                    <>
                        <h2 className="signup-title">✅ Email Verified!</h2>
                        <p className="signup-subtitle" style={{ marginBottom: '24px' }}>
                            {message}
                        </p>
                        <Link to="/signin" className="register-button" style={{ textDecoration: 'none', display: 'block', lineHeight: '44px' }}>
                            Go to Login
                        </Link>
                    </>
                );
            case 'error':
                return (
                    <>
                        <h2 className="signup-title">❌ Verification Failed</h2>
                        <p className="signup-subtitle" style={{ marginBottom: '24px' }}>
                            {message}
                        </p>
                        <Link to="/signup" className="register-button" style={{ textDecoration: 'none', display: 'block', lineHeight: '44px' }}>
                            Back to Sign Up
                        </Link>
                    </>
                );
            case 'verifying':
            default:
                return (
                    <>
                        <h2 className="signup-title">Verifying...</h2>
                        <p className="signup-subtitle">{message}</p>
                    </>
                );
        }
    };

    return (
        <div className="singnin-body">
            <div className="signup-container">
                <div className="signup-card" style={{ textAlign: 'center' }}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default EmailVerified;