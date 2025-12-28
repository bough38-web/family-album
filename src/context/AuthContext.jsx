/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { MASTER_KEY, DEFAULT_ADMIN } from '../config';
import { hashPassword, comparePassword } from '../utils/authHelpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const load = async () => {
            const storedUsers = JSON.parse(localStorage.getItem('familyUsers') || '[]');
            const adminExists = storedUsers.some(u => u.username === DEFAULT_ADMIN.username);
            let updatedUsers = storedUsers;
            if (!adminExists) {
                const hashed = await hashPassword(DEFAULT_ADMIN.password);
                const adminUser = { username: DEFAULT_ADMIN.username, password: hashed, role: 'admin' };
                updatedUsers = [...storedUsers, adminUser];
                localStorage.setItem('familyUsers', JSON.stringify(updatedUsers));
            }
            setUsers(updatedUsers);
            const storedAuth = localStorage.getItem('isFamilyAuth');
            if (storedAuth === 'true') {
                setIsAuthenticated(true);
            }
            setLoading(false);
        };
        load();
    }, []);

    const register = async (username, password) => {
        if (users.some(user => user.username === username)) {
            return { success: false, message: 'Username already exists' };
        }
        const hashed = await hashPassword(password);
        const newUser = { username, password: hashed, role: 'user' };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('familyUsers', JSON.stringify(updatedUsers));
        return { success: true };
    };

    const login = async (username, password) => {
        // Legacy support: master key without username
        if (!username && password === MASTER_KEY) {
            localStorage.setItem('isFamilyAuth', 'true');
            setIsAuthenticated(true);
            return true;
        }
        const user = users.find(u => u.username === username);
        if (user) {
            const match = await comparePassword(password, user.password);
            if (match) {
                localStorage.setItem('isFamilyAuth', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));
                setIsAuthenticated(true);
                return true;
            }
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('isFamilyAuth');
        localStorage.removeItem('currentUser');
        setIsAuthenticated(false);
    };

    // Admin reset password (requires master key)
    const adminResetPassword = async (username, newPassword, masterKey) => {
        const current = JSON.parse(localStorage.getItem('currentUser'));
        if (!current || current.role !== 'admin') {
            return { success: false, message: 'Admin privileges required' };
        }
        if (masterKey !== MASTER_KEY) {
            return { success: false, message: 'Invalid Master Key' };
        }
        // Call resetPassword which already hashes the new password
        const result = await resetPassword(username, newPassword, masterKey);
        return result;
    };

    const adminCreateUser = async (username, password, masterKey) => {
        // Confirm Admin Role
        const current = JSON.parse(localStorage.getItem('currentUser'));
        if (!current || current.role !== 'admin') {
            return { success: false, message: 'Admin privileges required' };
        }
        // Verify Master Key
        if (masterKey !== MASTER_KEY) {
            return { success: false, message: 'Invalid Master Key' };
        }
        // Check if user exists
        if (users.some(user => user.username === username)) {
            return { success: false, message: 'Username already exists' };
        }

        const hashed = await hashPassword(password);
        const newUser = { username, password: hashed, role: 'user' };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('familyUsers', JSON.stringify(updatedUsers));
        return { success: true, message: 'User created successfully' };
    };

    const resetPassword = async (username, newPassword, masterKey) => {
        // Verify Master Key
        if (masterKey !== MASTER_KEY) {
            return { success: false, message: 'Invalid Master Key' };
        }
        const userIndex = users.findIndex(u => u.username === username);
        if (userIndex === -1) {
            return { success: false, message: 'User not found' };
        }
        const hashed = await hashPassword(newPassword);
        const updatedUsers = [...users];
        updatedUsers[userIndex] = { ...updatedUsers[userIndex], password: hashed };
        setUsers(updatedUsers);
        localStorage.setItem('familyUsers', JSON.stringify(updatedUsers));
        return { success: true, message: 'Password reset successfully' };
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, register, resetPassword, adminResetPassword, adminCreateUser, loading, registeredUsers: users.map(u => ({ username: u.username, role: u.role })) }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
