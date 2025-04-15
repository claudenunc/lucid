import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AudioPlayer from '../components/AudioPlayer';
import TestWrapper from './TestWrapper';

describe('AudioPlayer Component', () => {
  // Mock HTMLMediaElement methods
  beforeAll(() => {
    window.HTMLMediaElement.prototype.load = jest.fn();
    window.HTMLMediaElement.prototype.play = jest.fn();
    window.HTMLMediaElement.prototype.pause = jest.fn();
    Object.defineProperty(window.HTMLMediaElement.prototype, 'currentTime', {
      get: jest.fn().mockReturnValue(30),
      set: jest.fn()
    });
  });

  test('renders with required props', () => {
    render(
      <TestWrapper>
        <AudioPlayer 
          src="/test-audio.mp3"
          title="Test Audio"
          duration={120}
        />
      </TestWrapper>
    );
    
    expect(screen.getByText('Test Audio')).toBeInTheDocument();
    expect(screen.getByText('0:30')).toBeInTheDocument();
    expect(screen.getByText('2:00')).toBeInTheDocument();
  });

  test('displays description when provided', () => {
    render(
      <TestWrapper>
        <AudioPlayer 
          src="/test-audio.mp3"
          title="Test Audio"
          description="This is a test audio file"
          duration={120}
        />
      </TestWrapper>
    );
    
    expect(screen.getByText('This is a test audio file')).toBeInTheDocument();
  });

  test('toggles play/pause when button is clicked', () => {
    render(
      <TestWrapper>
        <AudioPlayer 
          src="/test-audio.mp3"
          title="Test Audio"
          duration={120}
        />
      </TestWrapper>
    );
    
    // Initial state should be paused
    expect(screen.getByText('Play')).toBeInTheDocument();
    
    // Click play button
    fireEvent.click(screen.getByText('Play'));
    
    // Should now be playing
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    expect(screen.getByText('Pause')).toBeInTheDocument();
    
    // Click pause button
    fireEvent.click(screen.getByText('Pause'));
    
    // Should now be paused
    expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(screen.getByText('Play')).toBeInTheDocument();
  });

  test('calls onComplete when audio ends', () => {
    const mockOnComplete = jest.fn();
    
    render(
      <TestWrapper>
        <AudioPlayer 
          src="/test-audio.mp3"
          title="Test Audio"
          duration={120}
          onComplete={mockOnComplete}
        />
      </TestWrapper>
    );
    
    // Simulate audio ended event
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      fireEvent.ended(audioElement);
      
      // Check if onComplete was called
      expect(mockOnComplete).toHaveBeenCalled();
    }
  });
});
