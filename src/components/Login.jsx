import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid credentials.');
            setPassword('');
        }
    };

    return (
        <div className="login-container">
            <div className="login-bg-overlay"></div>
            <motion.div
                className="login-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="login-icon">
                    <Lock size={32} />
                </div>
                <h2>Family Access</h2>
                <p>Welcome back! Please login.</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        placeholder="Username (Optional for legacy)"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="login-input"
                        aria-label="Username"
                    />
                    <input
                        type="password"
                        placeholder="Password or Passcode"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        aria-label="Password or Passcode"
                    />
                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit" className="login-btn">
                        <span>Enter</span>
                        <ArrowRight size={18} />
                    </button>

                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                            New member? Sign Up
                        </Link>
                        <span style={{ margin: '0 0.5rem', color: 'var(--text-secondary)' }}>|</span>
                        <Link to="/forgot-password" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                            Forgot Password?
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
