import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { loadStripe } from '@stripe/stripe-js';
import App from './App';
import seoConfig from './seo/config.json';

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve(null)),
}));

// react-scripts resets mocks before each test; preserve eager import side effects.
const stripeInitializationsDuringAppImport = loadStripe.mock.calls.length;

beforeAll(() => {
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  loadStripe.mockImplementation(() => Promise.resolve(null));
});

afterAll(() => {
  window.scrollTo.mockRestore();
});

test('renders the dual-path home page without initializing payments', () => {
  render(<App />);

  const main = within(screen.getByRole('main'));
  expect(screen.getByRole('heading', { level: 1, name: 'Technology Made Simple.' })).toBeInTheDocument();
  expect(main.getByRole('link', { name: 'I Need Technology Help' })).toHaveAttribute('href', '/need-help');
  expect(main.getByRole('link', { name: 'I Want to Help' })).toHaveAttribute('href', '/want-to-help');
  expect(stripeInitializationsDuringAppImport).toBe(0);
  expect(loadStripe).not.toHaveBeenCalled();
});

test.each([
  ['/need-help', 'I Need Technology Help'],
  ['/want-to-help', 'I Want to Help'],
  ['/resources', 'Technology Resources'],
  ['/about', 'About TechSmart'],
  ['/contact', 'Contact Us'],
])('opens %s directly and retains the shared layout', async (route, heading) => {
  window.history.replaceState({}, '', route);
  render(<App />);

  // A cold secondary route also imports its theme; Jest transforms those modules.
  expect(await screen.findByRole('heading', { level: 1, name: heading }, { timeout: 5000 })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'TechSmart Learning for Seniors home' })).toBeInTheDocument();
  expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
});

test('opens the Advocate form directly with its own indexable page metadata', async () => {
  window.history.replaceState({}, '', '/advocate');
  render(<App />);

  expect(await screen.findByRole('heading', { level: 1, name: 'Become a TechSmart Advocate' }, { timeout: 5000 })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: 'Advocate Interest Form' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Submit Advocate Request' })).toBeInTheDocument();
  expect(document.title).toBe(seoConfig.routes['/advocate'].title);
  expect(document.title).not.toMatch(/Page Not Found/);
  expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'index,follow');
  expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute('href', expect.stringMatching(/\/advocate$/));
});

test('the I Want to Help Advocate link opens the form and updates page metadata', async () => {
  window.history.replaceState({}, '', '/want-to-help');
  render(<App />);
  expect(await screen.findByRole('heading', { level: 1, name: 'I Want to Help' }, { timeout: 5000 })).toBeInTheDocument();

  const advocate = within(screen.getByRole('main')).getByRole('link', { name: 'Become an Advocate' });
  expect(advocate).toHaveAttribute('href', '/advocate');
  userEvent.click(advocate);

  expect(await screen.findByRole('heading', { level: 1, name: 'Become a TechSmart Advocate' }, { timeout: 5000 })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/advocate');
  expect(document.title).toBe(seoConfig.routes['/advocate'].title);
  expect(screen.getByRole('button', { name: 'Submit Advocate Request' })).toBeInTheDocument();
});

test('loads the donation form and initializes Stripe only when entering the donation route', async () => {
  render(<App />);
  expect(loadStripe).not.toHaveBeenCalled();

  userEvent.click(within(screen.getByRole('main')).getByRole('link', { name: 'I Want to Help' }));
  expect(await screen.findByRole('heading', { level: 1, name: 'I Want to Help' }, { timeout: 5000 })).toBeInTheDocument();
  expect(loadStripe).not.toHaveBeenCalled();

  const donate = within(screen.getByRole('main')).getByRole('link', { name: 'Donate' });
  expect(donate).toHaveAttribute('href', '/donate');
  userEvent.click(donate);

  expect(await screen.findByRole('heading', { level: 1, name: 'Make a Donation' }, { timeout: 5000 })).toBeInTheDocument();
  expect(loadStripe).toHaveBeenCalledTimes(1);
  expect(loadStripe).toHaveBeenCalledWith(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  expect(screen.getByRole('link', { name: 'TechSmart Learning for Seniors home' })).toBeInTheDocument();
});
