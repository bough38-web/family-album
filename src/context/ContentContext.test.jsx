import { render, screen, waitFor } from '@testing-library/react';
import { ContentProvider, useContent } from './ContentContext';
import { describe, it, expect, vi } from 'vitest';
import * as idb from 'idb-keyval';

// Mock idb-keyval
vi.mock('idb-keyval', () => ({
    get: vi.fn(),
    set: vi.fn(),
}));

const TestComponent = () => {
    const { heroContent, updateHero, timelineEvents, addTimelineEvent } = useContent();
    return (
        <div>
            <div data-testid="hero-title">{heroContent.title}</div>
            <button onClick={() => updateHero({ title: 'Updated Hero' })}>Update Hero</button>

            <div data-testid="timeline-count">{timelineEvents.length}</div>
            <button onClick={() => addTimelineEvent({ date: '2025-01-01', title: 'New Event' })}>Add Event</button>
        </div>
    );
};

describe('ContentContext', () => {
    it('loads default content if idb is empty', async () => {
        idb.get.mockResolvedValue(undefined); // Simulate empty DB

        render(
            <ContentProvider>
                <TestComponent />
            </ContentProvider>
        );

        // Should load default hero title
        await waitFor(() => {
            expect(screen.getByTestId('hero-title')).toHaveTextContent('Cherished Moments');
        });
    });

    it('updates hero content', async () => {
        idb.get.mockResolvedValue(undefined);

        render(
            <ContentProvider>
                <TestComponent />
            </ContentProvider>
        );

        const btn = await screen.findByText('Update Hero');
        btn.click();

        await waitFor(() => {
            expect(screen.getByTestId('hero-title')).toHaveTextContent('Updated Hero');
        });

        expect(idb.set).toHaveBeenCalledWith('heroContent', expect.objectContaining({ title: 'Updated Hero' }));
    });
});
