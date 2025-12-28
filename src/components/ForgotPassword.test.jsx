import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock context
const mockResetPassword = vi.fn();
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        resetPassword: mockResetPassword
    })
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ForgotPassword Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all form fields', () => {
        renderWithRouter(<ForgotPassword />);
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Master Key/)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm New Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Reset Password/i })).toBeInTheDocument();
    });

    it('validates password mismatch locally', async () => {
        renderWithRouter(<ForgotPassword />);

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText(/Master Key/), { target: { value: '1234' } });
        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), { target: { value: 'password456' } });

        fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

        expect(await screen.findByText("New passwords don't match")).toBeInTheDocument();
        expect(mockResetPassword).not.toHaveBeenCalled();
    });

    it('submits correctly when valid', async () => {
        mockResetPassword.mockResolvedValue({ success: true, message: 'Reset successful' });
        renderWithRouter(<ForgotPassword />);

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user1' } });
        fireEvent.change(screen.getByPlaceholderText(/Master Key/), { target: { value: '1234' } });
        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpass' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), { target: { value: 'newpass' } });

        fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

        await waitFor(() => {
            expect(mockResetPassword).toHaveBeenCalledWith('user1', 'newpass', '1234');
            expect(screen.getByText('Reset successful')).toBeInTheDocument();
        });
    });
});
