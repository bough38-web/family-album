import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock mocks
const mockLogin = vi.fn();
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin
    })
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form elements', () => {
        renderWithRouter(<Login />);
        expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /enter/i })).toBeInTheDocument();
        expect(screen.getByText(/Family Access/i)).toBeInTheDocument();
    });

    it('handles successful login', async () => {
        mockLogin.mockResolvedValue(true);
        renderWithRouter(<Login />);

        fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });

        const submitBtn = screen.getByRole('button', { name: /enter/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('handles failed login and clears password', async () => {
        mockLogin.mockResolvedValue(false);
        renderWithRouter(<Login />);

        const passwordInput = screen.getByPlaceholderText(/Password/i);
        fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });

        fireEvent.click(screen.getByRole('button', { name: /enter/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('testuser', 'wrongpass');
            expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
            expect(passwordInput.value).toBe('');
        });
    });
});
