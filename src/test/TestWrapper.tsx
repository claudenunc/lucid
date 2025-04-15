import React from 'react';
import { render, screen } from '@testing-library/react';
import { DreamProvider } from '../lib/dream-context';

// Test wrapper component to provide context
const TestWrapper = ({ children }) => {
  return <DreamProvider>{children}</DreamProvider>;
};

export default TestWrapper;
