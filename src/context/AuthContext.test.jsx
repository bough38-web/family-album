import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import { MASTER_KEY } from '../config'; // Import real config or mock it
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock Component to consume AuthContext
const TestComponent = () => {
    const { registeredUsers, register, adminCreateUser, login, isAuthenticated } = useAuth();

    return (
        <div>
            <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
            <button onClick={() => register('newuser', 'password123')}>Register User</button>
            <button onClick={() => adminCreateUser('admincreated', 'password123', MASTER_KEY)}>Admin Create</button>
            <ul data-testid="user-list">
                {registeredUsers.map(u => (
                    <li key={u.username} data-testid={`user-${u.username}`}>
                        {u.username} ({u.role})
                    </li>
                ))}
            </ul>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('initializes with default admin user', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('user-admin')).toBeInTheDocument();
        });

        expect(screen.getByText('admin (admin)')).toBeInTheDocument();
    });

    it('adds new user to registeredUsers list upon registration', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // Wait for init
        await waitFor(() => screen.getByTestId('user-admin'));

        const registerBtn = screen.getByText('Register User');
        await userEvent.click(registerBtn);

        await waitFor(() => {
            expect(screen.getByTestId('user-newuser')).toBeInTheDocument();
        });
        expect(screen.getByText('newuser (user)')).toBeInTheDocument();
    });

    it('adminCreateUser adds user to list', async () => {
        // Mock current user as admin for adminCreateUser check
        localStorage.setItem('currentUser', JSON.stringify({ username: 'admin', role: 'admin' }));

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => screen.getByTestId('user-admin'));

        const adminCreateBtn = screen.getByText('Admin Create');
        await userEvent.click(adminCreateBtn);

        await waitFor(() => {
            expect(screen.getByTestId('user-admincreated')).toBeInTheDocument();
        });
        expect(screen.getByText('admincreated (user)')).toBeInTheDocument();
    });
});
