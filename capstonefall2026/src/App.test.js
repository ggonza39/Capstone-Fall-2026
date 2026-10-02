import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the dual-path home page', () => {
  render(<App />);
  const needHelpLinks = screen.getAllByText(/i need help/i);
  expect(needHelpLinks.length).toBeGreaterThan(0);
});
