import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadMessage from '@/components/ui/LoadMessage';

describe('LoadMessage component', () => {
  it('renders the loading indicator with bouncing dots', () => {
    const { getByTestId } = render(<LoadMessage />);

    // Verifica che il container principale con data-testid 'loading-indicator' sia presente
    const loadingIndicator = getByTestId('loading-indicator');
    expect(loadingIndicator).toBeInTheDocument();

    // Verifica che ci siano 3 div all'interno, corrispondenti ai 3 cerchi
    const dots = loadingIndicator.querySelectorAll('div');
    expect(dots).toHaveLength(3);

    // Verifica che tutti i div abbiano la classe 'animate-bounce'
    dots.forEach(dot => {
      expect(dot).toHaveClass('animate-bounce');
    });
  });
});
