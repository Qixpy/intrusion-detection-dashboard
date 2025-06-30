import { render, screen } from '@testing-library/react';
import App from './App';

// Mock axios to prevent network calls in tests
jest.mock('axios');

test('renders intrusion detection dashboard', () => {
  render(<App />);
  const headerElement = screen.getByText(/Intrusion Detection Dashboard/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders blue team security operations subtitle', () => {
  render(<App />);
  const subtitleElement = screen.getByText(/Blue Team Security Operations/i);
  expect(subtitleElement).toBeInTheDocument();
});

test('renders upload network logs section', () => {
  render(<App />);
  const uploadElement = screen.getByText(/Upload Network Logs/i);
  expect(uploadElement).toBeInTheDocument();
});

test('renders security alerts section', () => {
  render(<App />);
  const alertsElement = screen.getByText(/Security Alerts/i);
  expect(alertsElement).toBeInTheDocument();
});

test('renders alert trends section', () => {
  render(<App />);
  const trendsElement = screen.getByText(/Alert Trends/i);
  expect(trendsElement).toBeInTheDocument();
});
