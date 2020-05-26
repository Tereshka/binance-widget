import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders ADA/BTC', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/BTC/i);
  expect(linkElement).toBeInTheDocument();
});
