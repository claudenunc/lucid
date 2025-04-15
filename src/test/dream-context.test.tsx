import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DreamProvider, useDreamContext } from '../lib/dream-context';

// Test component that uses the context
const TestConsumer = () => {
  const { 
    theme, 
    setTheme, 
    isAudioEnabled, 
    setIsAudioEnabled,
    breathingRate,
    setBreathingRate,
    user,
    setUser
  } = useDreamContext();
  
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <button onClick={() => setTheme('cosmic')}>Set Cosmic Theme</button>
      
      <div data-testid="audio-enabled">{isAudioEnabled ? 'enabled' : 'disabled'}</div>
      <button onClick={() => setIsAudioEnabled(!isAudioEnabled)}>Toggle Audio</button>
      
      <div data-testid="breathing-rate">{breathingRate}</div>
      <button onClick={() => setBreathingRate(6)}>Change Breathing Rate</button>
      
      <div data-testid="user">{user ? user.username : 'no user'}</div>
      <button onClick={() => setUser({ id: 1, username: 'testuser', email: 'test@example.com' })}>Set User</button>
    </div>
  );
};

describe('DreamContext', () => {
  test('provides default values', () => {
    render(
      <DreamProvider>
        <TestConsumer />
      </DreamProvider>
    );
    
    expect(screen.getByTestId('theme')).toHaveTextContent('lucid');
    expect(screen.getByTestId('audio-enabled')).toHaveTextContent('enabled');
    expect(screen.getByTestId('breathing-rate')).toHaveTextContent('4');
    expect(screen.getByTestId('user')).toHaveTextContent('no user');
  });

  test('updates theme when setTheme is called', () => {
    render(
      <DreamProvider>
        <TestConsumer />
      </DreamProvider>
    );
    
    fireEvent.click(screen.getByText('Set Cosmic Theme'));
    expect(screen.getByTestId('theme')).toHaveTextContent('cosmic');
  });

  test('toggles audio when setIsAudioEnabled is called', () => {
    render(
      <DreamProvider>
        <TestConsumer />
      </DreamProvider>
    );
    
    expect(screen.getByTestId('audio-enabled')).toHaveTextContent('enabled');
    fireEvent.click(screen.getByText('Toggle Audio'));
    expect(screen.getByTestId('audio-enabled')).toHaveTextContent('disabled');
  });

  test('updates breathing rate when setBreathingRate is called', () => {
    render(
      <DreamProvider>
        <TestConsumer />
      </DreamProvider>
    );
    
    expect(screen.getByTestId('breathing-rate')).toHaveTextContent('4');
    fireEvent.click(screen.getByText('Change Breathing Rate'));
    expect(screen.getByTestId('breathing-rate')).toHaveTextContent('6');
  });

  test('sets user when setUser is called', () => {
    render(
      <DreamProvider>
        <TestConsumer />
      </DreamProvider>
    );
    
    expect(screen.getByTestId('user')).toHaveTextContent('no user');
    fireEvent.click(screen.getByText('Set User'));
    expect(screen.getByTestId('user')).toHaveTextContent('testuser');
  });
});
