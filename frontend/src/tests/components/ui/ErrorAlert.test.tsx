import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

describe('ErrorAlert component', () => {
  const errorCases = [
    { code: 400, title: "Connection Error", message: "An error occurred while connecting to the server to fetch history." },
    { code: 401, title: "Connection Error", message: "An error occurred while connecting to the server to send the message." },
    { code: 408, title: "Timeout", message: "The request took too long to fetch the history." },
    { code: 409, title: "Timeout", message: "The request took too long to get an answer for the question." },
    { code: 500, title: "Server Error", message: "An internal server error occurred while fetching history. Please try again later." },
    { code: 501, title: "Server Error", message: "An internal server error occurred while sending the message. Please try again later." },
    { code: 1, title: "Answer Too Long", message: "The generated answer was too long to process. Please rephrase your question." },
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
