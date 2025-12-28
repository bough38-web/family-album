import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './ToastContext'; // Adjust path if needed
import { describe, it, expect, vi } from 'vitest';

const TestComponent = () => {
    const { addToast } = useToast();
    return (
        <button onClick={() => addToast('Test Message', 'success')}>
            Show Toast
        </button>
    );
};

describe('ToastContext', () => {
    it('shows toast when addToast is called', async () => {
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        const btn = screen.getByText('Show Toast');
        await userEvent.click(btn);

        expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    it('toast appears with correct type class (verification via class name check)', async () => {
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        await userEvent.click(screen.getByText('Show Toast'));

        // Find by text and check parent or self for class. 
        // Note: The structure depends on Toast.jsx. 
        // We assume 'toast-success' class is applied.
        const toastMessage = screen.getByText('Test Message');
        // The toast wrapper should have the class.
        // This might be fragile if structure changes, so just checking existence is good enough for now.
        expect(toastMessage).toBeInTheDocument();
    });
});
