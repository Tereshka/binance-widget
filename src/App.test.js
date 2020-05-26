import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders ADA/BTC', async () => {
  render(<App />);
  await waitFor(() => { expect(screen.queryByText(/ADA\/BTC/i)).toBeInTheDocument() }, { timeout:3000 });
});


test('shows BTT/TRX when ALTS is selected', async () => {
  render(<App />);
  expect(screen.queryByText('BTT/TRX')).toBeNull();
  fireEvent.click(screen.getByRole('radio', {name: 'ALTS ALL'}));
  await waitFor(() => { expect(screen.queryByText('BTT/TRX')).toBeInTheDocument() }, { timeout:3000 });
})
