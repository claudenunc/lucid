import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BreathingGuide from '../components/BreathingGuide';
import TestWrapper from './TestWrapper';

describe('BreathingGuide Component', () => {
  test('renders with default props', () => {
    render(
      <TestWrapper>
        <BreathingGuide />
      </TestWrapper>
    );
    
    expect(screen.getByText('Breathing Guide')).toBeInTheDocument();
    expect(screen.getByText('Prepare to begin')).toBeInTheDocument();
    expect(screen.getByText('Start Breathing Guide')).toBeInTheDocument();
  });

  test('starts and stops breathing guide when button is clicked', () => {
    render(
      <TestWrapper>
        <BreathingGuide />
      </TestWrapper>
    );
    
    // Start breathing guide
    fireEvent.click(screen.getByText('Start Breathing Guide'));
    
    // Check if it's active
    expect(screen.getByText('Stop')).toBeInTheDocument();
    
    // Stop breathing guide
    fireEvent.click(screen.getByText('Stop'));
    
    // Check if it's inactive
    expect(screen.getByText('Start Breathing Guide')).toBeInTheDocument();
  });

  test('displays correct instruction based on current phase', () => {
    jest.useFakeTimers();
    
    render(
      <TestWrapper>
        <BreathingGuide />
      </TestWrapper>
    );
    
    // Start breathing guide
    fireEvent.click(screen.getByText('Start Breathing Guide'));
    
    // Initial phase should be inhale
    expect(screen.getByText('Inhale slowly')).toBeInTheDocument();
    
    // Advance timers to trigger phase change
    jest.advanceTimersByTime(5000);
    
    // Should now be in hold phase
    expect(screen.getByText('Hold your breath')).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  test('calls onComplete when breathing guide is completed', () => {
    const mockOnComplete = jest.fn();
    
    render(
      <TestWrapper>
        <BreathingGuide duration={1} onComplete={mockOnComplete} />
      </TestWrapper>
    );
    
    // Start breathing guide
    fireEvent.click(screen.getByText('Start Breathing Guide'));
    
    // Complete session early
    fireEvent.click(screen.getByText('Complete'));
    
    // Check if onComplete was called
    expect(mockOnComplete).toHaveBeenCalled();
  });
});
