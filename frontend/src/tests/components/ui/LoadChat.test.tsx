import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadChat from '@/components/ui/LoadChat';

describe('LoadChat component', () => {
  it('renders the spinner element', () => {
    const { container } = render(<LoadChat />);
    // Verifica che ci sia un elemento e che sia un div
    const spinner = container.firstChild;
    expect(spinner).toBeInTheDocument();
    expect(spinner?.nodeName).toBe('DIV');
  });
});