import { render, screen } from '@testing-library/react';
import { AppUi } from './components/AppUI';

test('renders learn react link', () => {
  render(<AppUi />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});