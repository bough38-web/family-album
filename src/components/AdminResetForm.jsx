import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

import './AdminResetForm.css';

const AdminResetForm = () => {
    const { adminResetPassword } = useAuth();
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [masterKey, setMasterKey] = useState('');
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await adminResetPassword(username, newPassword, masterKey);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setUsername('');
            setNewPassword('');
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
        >
            <h4>Admin Password Reset</h4>
            <form onSubmit={handleSubmit} className="reset-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="reset-input"
                    required
                    aria-label="Username to reset"
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="reset-input"
                    required
                    aria-label="New Password"
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
                <button type="submit" className="reset-btn">
                    Reset Password
                </button>
            </form>
            {message && (
                <p className={message.type === 'success' ? 'msg-success' : 'msg-error'}>{message.text}</p>
            )}
        </motion.div>
    );
};

export default AdminResetForm;
