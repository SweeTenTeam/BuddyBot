import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModeToggle from '@/components/Switch';
import { useTheme } from 'next-themes';

// Mocking the useTheme hook
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('ModeToggle', () => {
  it('should render Sun icon when theme is light', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    });

    render(<ModeToggle />);

    // Assert that the Sun icon is present
    const sunIcon = screen.getByTestId('sun-icon');
    expect(sunIcon).toBeInTheDocument();

    // Check that the Moon icon is not present (since the theme is light)
    const moonIcon = screen.queryByTestId('moon-icon');
    expect(moonIcon).not.toBeInTheDocument();
  });

  it('should render Moon icon when theme is dark', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
    });

    render(<ModeToggle />);

    // Assert that the Moon icon is present
    const moonIcon = screen.getByTestId('moon-icon');
    expect(moonIcon).toBeInTheDocument();

    // Check that the Sun icon is not present (since the theme is dark)
    const sunIcon = screen.queryByTestId('sun-icon');
    expect(sunIcon).not.toBeInTheDocument();
  });

  it('should change theme from light to dark on button click', () => {
    // Mock initial theme state
    const setThemeMock = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });

    render(<ModeToggle />);

    const button = screen.getByTestId('theme-toggle-button');

    // Simulate a click event to toggle the theme to dark
    fireEvent.click(button);

    // Assert that setTheme was called with 'dark'
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('should change theme from dark to light on button click', () => {
    // Mock initial theme state as dark
    const setThemeMock = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });

    render(<ModeToggle />);

    const button = screen.getByTestId('theme-toggle-button');

    // Simulate a click event to toggle the theme to light
    fireEvent.click(button);

    // Assert that setTheme was called with 'light'
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});
