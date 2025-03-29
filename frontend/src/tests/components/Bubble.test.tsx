import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Bubble from '@/components/Bubble';
import { Message } from '@/types/Message';

// Mocka le dipendenze
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked ReactMarkdown</div>),
}));

jest.mock('remark-gfm', () => ({}));
jest.mock('rehype-highlight', () => ({}));

describe('Bubble component', () => {
  it('renders Bubble component correctly, user', () => {
    // Crea un oggetto message che viene passato al componente
    const message: Message = { content: "Hello, World!", timestamp: new Date().toISOString() };

    // Renderizza il componente Bubble
    render(
      <Bubble message={message} user={true} error={false} loading={false} />
    );

    // Verifica che il contenuto del messaggio sia visualizzato correttamente
    const bubbleElement = screen.getByText(/Hello, World!/i);
    expect(bubbleElement).toBeInTheDocument();
  });

  it('renders Bubble component correctly, bot', () => {
    // Crea un oggetto message che viene passato al componente
    const message: Message = { content: "Hello, World!", timestamp: new Date().toISOString() };

    // Renderizza il componente Bubble
    render(
      <Bubble message={message} user={false} error={false} loading={false} />
    );

    // Verifica che il mock di ReactMarkdown venga usato
    const markdownMock = screen.getByText(/Mocked ReactMarkdown/);
    expect(markdownMock).toBeInTheDocument();
  });

  it('renders Bubble component correctly, alert', () => {
    // Crea un oggetto message che viene passato al componente
    const message: Message = { content: "Hello, World!", timestamp: new Date().toISOString() };

    // Renderizza il componente Bubble
    render(
      <Bubble message={message} user={false} error={true} loading={false} />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders Bubble component correctly, loading', () => {
    // Crea un oggetto message che viene passato al componente
    const message: Message = { content: "Hello, World!", timestamp: new Date().toISOString() };

    // Renderizza il componente Bubble
    render(
      <Bubble message={message} user={false} error={false} loading={true} />
    );

    // Verifica che il componente LoadMessage sia visualizzato
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
});
