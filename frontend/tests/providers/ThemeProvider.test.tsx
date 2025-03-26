import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes';

jest.mock('next-themes', () => ({
  ThemeProvider: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ThemeProvider component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Hello World</div>
      </ThemeProvider>
    );

    expect(getByText('Hello World')).toBeInTheDocument();
  });
});
