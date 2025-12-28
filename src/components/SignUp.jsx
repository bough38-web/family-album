import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import './Login.css'; // Reuse Login styles

const SignUp = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (inviteCode !== '1234') {
            setError('Invalid Family Code');
            return;
        }

        const result = register(name, password);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
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
                    <UserPlus size={32} />
                </div>
                <h2>Join the Family</h2>
                <p>Create your personal access account.</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        placeholder="Your Name (ID)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="login-input"
                        required
                        aria-label="Your Name (ID)"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                        aria-label="Password"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="login-input"
                        required
                        aria-label="Confirm Password"
                    />
                    <input
                        type="password"
                        placeholder="Family Invite Code"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        className="login-input"
                        required
                        aria-label="Family Invite Code"
                    />

                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit" className="login-btn">
                        <span>Sign Up</span>
                        <ArrowRight size={18} />
                    </button>

                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                            Already have an account? Login
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default SignUp;
