import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the todo form', () => {
  render(<App />);
  expect(screen.getByRole('button', {name: /add todo/i})).toBeInTheDocument();
});
