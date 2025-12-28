import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminResetForm from './AdminResetForm';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock context
const mockAdminResetPassword = vi.fn();
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        adminResetPassword: mockAdminResetPassword
    })
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
}));

describe('AdminResetForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders form inputs', () => {
        render(<AdminResetForm />);
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Master Key')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Reset Password/i })).toBeInTheDocument();
    });

    it('handles form submission success', async () => {
        mockAdminResetPassword.mockResolvedValue({ success: true, message: 'Password reset successfully' });
        render(<AdminResetForm />);

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'alice' } });
        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'secret' } });
        fireEvent.change(screen.getByPlaceholderText('Master Key'), { target: { value: '1234' } });

        fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

        await waitFor(() => {
            expect(mockAdminResetPassword).toHaveBeenCalledWith('alice', 'secret', '1234');
            expect(screen.getByText('Password reset successfully')).toBeInTheDocument();
            // Inputs should be cleared
            expect(screen.getByPlaceholderText('Username').value).toBe('');
        });
    });

    it('displays error message on failure', async () => {
        mockAdminResetPassword.mockResolvedValue({ success: false, message: 'Invalid Key' });
        render(<AdminResetForm />);

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'bob' } });
        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: '123' } });
        fireEvent.change(screen.getByPlaceholderText('Master Key'), { target: { value: '0000' } });

        fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid Key')).toBeInTheDocument();
        });
    });
});
