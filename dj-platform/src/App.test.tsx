import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders DJ Platform Pro', () => {
  render(<App />);
  const platformTitle = screen.getByText(/DJ Platform Pro/i);
  expect(platformTitle).toBeInTheDocument();
});
