import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import './Login.css'; // Reuse Login styles

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [masterKey, setMasterKey] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        if (newPassword.length < 4) {
            setError("Password must be at least 4 characters");
            return;
        }

        const result = await resetPassword(username, newPassword, masterKey);

        if (result.success) {
            setSuccess(result.message);
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-bg-overlay"></div>
            <motion.div
                className="login-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="login-icon">
                    <KeyRound size={32} />
                </div>
                <h2>Reset Password</h2>
                <p>Use Master Key to verify identity</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                            required
                            aria-label="Username"
                        />
                    </div>

                    <div className="input-group">
                        <div style={{ position: 'relative' }}>
                            <ShieldCheck size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', checking: 'var(--text-secondary)' }} />
                            <input
                                type="password"
                                placeholder="Master Key (1234)"
                                value={masterKey}
                                onChange={(e) => setMasterKey(e.target.value)}
                                className="login-input"
                                style={{ paddingLeft: '45px' }}
                                required
                                aria-label="Master Key"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="login-input"
                            required
                            aria-label="New Password"
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="login-input"
                            required
                            aria-label="Confirm New Password"
                        />
                    </div>

                    {error && <p className="error-msg">{error}</p>}
                    {success && <p className="success-msg" style={{ color: '#4ade80', textAlign: 'center', marginBottom: '1rem' }}>{success}</p>}

                    <button type="submit" className="login-btn">
                        <span>Reset Password</span>
                        <ArrowRight size={18} />
                    </button>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
