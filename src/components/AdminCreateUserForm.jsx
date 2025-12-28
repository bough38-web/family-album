import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

import './AdminResetForm.css'; // Reusing the same styles

const AdminCreateUserForm = () => {
    const { adminCreateUser } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [masterKey, setMasterKey] = useState('');
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        if (!username || !password || !masterKey) {
            setMessage({ type: 'error', text: 'All fields are required' });
            return;
        }

        const result = await adminCreateUser(username, password, masterKey);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setUsername('');
            setPassword('');
            setMasterKey('');
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };

    return (
        <motion.div
            className="admin-reset-form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}
        >
            <h4>Create New User (Admin Force Register)</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                Manually register a new family member account.
            </p>
            <form onSubmit={handleSubmit} className="reset-form">
                <input
                    type="text"
                    placeholder="New Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="reset-input"
                    required
                    aria-label="New Username"
                />
                <input
                    type="password"
                    placeholder="Initial Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="reset-input"
                    required
                    aria-label="Initial Password"
                />
                <input
                    type="text"
                    placeholder="Master Key"
                    value={masterKey}
                    onChange={(e) => setMasterKey(e.target.value)}
                    className="reset-input"
                    required
                    aria-label="Master Key"
                />
                <button type="submit" className="reset-btn" style={{ background: 'var(--color-accent)' }}>
                    Create User
                </button>
            </form>
            {message && (
                <p className={message.type === 'success' ? 'msg-success' : 'msg-error'}>{message.text}</p>
            )}
        </motion.div>
    );
};

export default AdminCreateUserForm;
