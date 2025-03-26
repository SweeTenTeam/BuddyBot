import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

describe('ErrorAlert component', () => {
  const errorCases = [
    { code: 404, title: 'Not Found', message: 'The requested resource was not found.' },
    { code: 500, title: 'Server Error', message: 'Something went wrong on our end. Please try again later.' },
    { code: 505, title: 'Answer too long', message: 'The answer generated was too long to be handled. Please rephrase your question.' },
    { code: 506, title: 'No answer', message: 'No answer was generated for your question. Please rephrase it.' },
  ];

  errorCases.forEach(({ code, title, message }) => {
    it(`renders error alert for status code ${code}`, async () => {
      render(<ErrorAlert statusCode={code} />);

      // Verifica che il titolo e il messaggio siano presenti
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(message)).toBeInTheDocument();

      // Attende che l'useEffect imposti il timestamp e verifichiamo che non sia vuoto
      await waitFor(() => {
        const timestamp = screen.getByText((content, element) => {
          // Verifica che il contenuto sia una stringa oraria (es. "12:34:56")
          return /\d{1,2}:\d{2}:\d{2}/.test(content);
        });
        expect(timestamp.textContent?.trim()).not.toBe('');
      });
    });
  });

  it('renders error alert for an unknown status code', async () => {
    render(<ErrorAlert statusCode={999} />);

    // Verifica che venga mostrato il messaggio di default per errori sconosciuti
    expect(screen.getByText('Unknown Error')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument();

    await waitFor(() => {
      const timestamp = screen.getByText((content, element) => {
        return /\d{1,2}:\d{2}:\d{2}/.test(content);
      });
      expect(timestamp.textContent?.trim()).not.toBe('');
    });
  });
});
