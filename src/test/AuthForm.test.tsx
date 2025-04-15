import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthForm from '../components/AuthForm';
import TestWrapper from './TestWrapper';

describe('AuthForm Component', () => {
  test('renders login form by default', () => {
    render(
      <TestWrapper>
        <AuthForm mode="login" />
      </TestWrapper>
    );
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
  });

  test('renders registration form when mode is register', () => {
    render(
      <TestWrapper>
        <AuthForm mode="register" />
      </TestWrapper>
    );
    
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  test('validates form inputs', () => {
    render(
      <TestWrapper>
        <AuthForm mode="login" />
      </TestWrapper>
    );
    
    // Submit without filling in fields
    fireEvent.click(screen.getByText('Sign In'));
    
    // Check for validation errors
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  test('calls onSuccess when form is submitted successfully', async () => {
    const mockOnSuccess = jest.fn();
    
    render(
      <TestWrapper>
        <AuthForm mode="login" onSuccess={mockOnSuccess} />
      </TestWrapper>
    );
    
    // Fill in form fields
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Sign In'));
    
    // Wait for mock API call
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    // Check if onSuccess was called
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
