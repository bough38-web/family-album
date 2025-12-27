import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login(password)) {
            navigate('/');
        } else {
            setError('Incorrect password. Hint: 1234');
            setPassword('');
            // Shake animation trigger could go here
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
                <p>Please enter the family passcode to view the album.</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="password"
                        placeholder="Passcode"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        autoFocus
                    />
                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit" className="login-btn">
                        <span>Enter</span>
                        <ArrowRight size={18} />
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
