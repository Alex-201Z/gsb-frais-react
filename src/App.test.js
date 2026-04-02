import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock(
  'react-router-dom',
  () => ({
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: () => null,
    Route: () => null,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
    useNavigate: () => jest.fn(),
    useParams: () => ({}),
  }),
  { virtual: true }
);

jest.mock(
  'axios',
  () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
  { virtual: true }
);

test('affiche le lien de connexion dans la barre de navigation', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: /connexion/i })).toBeInTheDocument();
});
