import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Bubble from '@/components/Bubble';
import { Message } from '@/types/Message';
import { info } from 'console';

// Mocka le dipendenze
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked ReactMarkdown</div>),
}));

jest.mock('remark-gfm', () => ({}));
jest.mock('rehype-highlight', () => ({}));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: query === "(hover: none)",
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('Bubble component', () => {
  it('renders Bubble component correctly, user', () => {
    // Crea un oggetto message che viene passato al componente
    const message: Message = { content: "Hello, World!", timestamp: new Date().toISOString() };

    // Renderizza il componente Bubble
    render(
      <Bubble message={message} user={true} error={0} loading={false} />
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
      <Bubble message={message} user={false} error={0} loading={false} lastUpdated={new Date().toISOString()}/>
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
      <Bubble message={message} user={false} error={501} loading={false} lastUpdated={new Date().toISOString()}/>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders Bubble component correctly, loading', () => {
    // Crea un oggetto message che viene passato al componente
    const message: Message = { content: "Hello, World!", timestamp: new Date().toISOString() };

    // Renderizza il componente Bubble
    render(
      <Bubble message={message} user={false} error={0} loading={true} lastUpdated={new Date().toISOString()} />
    );

    // Verifica che il componente LoadMessage sia visualizzato
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('toggles visibility on click in mobile view', () => {
    const message: Message = { content: "Hello, World!", timestamp: new Date().toISOString() };

    render(<Bubble message={message} user={false} error={0} loading={false} lastUpdated={new Date().toISOString()} />);

    const infoIcon = screen.getByTestId('info-icon');
    const tooltip = screen.getByText(/Last Updated:/).parentElement;

    // Verifica che il tooltip sia nascosto inizialmente
    expect(tooltip).toHaveClass("hidden");

    // Simula il click sull'icona
    fireEvent.click(infoIcon);

    // Ora il tooltip dovrebbe essere visibile
    expect(tooltip).not.toHaveClass("hidden");
  });
});
