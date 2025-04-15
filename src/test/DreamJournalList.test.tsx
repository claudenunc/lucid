import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DreamJournalList from '../components/DreamJournalList';
import TestWrapper from './TestWrapper';

describe('DreamJournalList Component', () => {
  test('renders loading state initially', () => {
    render(
      <TestWrapper>
        <DreamJournalList />
      </TestWrapper>
    );
    
    // Check for loading indicators
    expect(screen.getByText('Dream Journal')).toBeInTheDocument();
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  test('renders dream journal entries after loading', async () => {
    render(
      <TestWrapper>
        <DreamJournalList />
      </TestWrapper>
    );
    
    // Wait for mock data to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for entries
    expect(screen.getByText('Flying over mountains')).toBeInTheDocument();
    expect(screen.getByText('Underwater city exploration')).toBeInTheDocument();
    expect(screen.getByText('Meeting my dream guide')).toBeInTheDocument();
  });

  test('filters entries based on search input', async () => {
    render(
      <TestWrapper>
        <DreamJournalList />
      </TestWrapper>
    );
    
    // Wait for mock data to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Enter search term
    fireEvent.change(screen.getByPlaceholderText('Search dreams...'), {
      target: { value: 'guide' }
    });
    
    // Check filtered results
    expect(screen.getByText('Meeting my dream guide')).toBeInTheDocument();
    expect(screen.queryByText('Flying over mountains')).not.toBeInTheDocument();
  });

  test('sorts entries based on selected sort option', async () => {
    render(
      <TestWrapper>
        <DreamJournalList />
      </TestWrapper>
    );
    
    // Wait for mock data to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Change sort option to lucidity (highest first)
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'lucidity-desc' }
    });
    
    // Get all entry elements
    const entries = document.querySelectorAll('.rounded-lg.transition.cursor-pointer');
    
    // First entry should be the one with highest lucidity
    expect(entries[0].textContent).toContain('Meeting my dream guide');
    expect(entries[0].textContent).toContain('Lucidity: 9/10');
  });

  test('calls onSelectEntry when an entry is clicked', async () => {
    const mockOnSelectEntry = jest.fn();
    
    render(
      <TestWrapper>
        <DreamJournalList onSelectEntry={mockOnSelectEntry} />
      </TestWrapper>
    );
    
    // Wait for mock data to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Click on an entry
    fireEvent.click(screen.getByText('Flying over mountains'));
    
    // Check if onSelectEntry was called with correct ID
    expect(mockOnSelectEntry).toHaveBeenCalledWith(1);
  });
});
