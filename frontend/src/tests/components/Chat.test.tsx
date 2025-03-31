import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chat from '@/components/Chat';
import { useChat } from '@/providers/chatProvider';
import { ChatContext } from "@/types/ChatContext";

jest.mock("@/providers/chatProvider", () => ({
  useChat: jest.fn(),
}));

describe("Chat component", () => {
  it("renders the chat component", () => {
    (useChat as jest.Mock).mockReturnValue({
      state: {
        messages: [{
          id: "1",
          question: { content: "What is your name?", timestamp: "123" },
          answer: { content: "My name is Chatbot.", timestamp: "124" },
          error: true,
          loading: false
        }],
        loadingHistory: false,
        errorHistory: false,
        hasMore: false
      },
      dispatch: jest.fn(),
      loadHistory: jest.fn(),
      sendMessage: jest.fn(),
    });

    render(<Chat />);

    // Verifica che il componente chat sia presente
    expect(screen.getByTestId("chat-component")).toBeInTheDocument();
    expect(screen.queryByTestId("load-more")).toBeNull();
    expect(screen.queryByTestId("error-alert")).toBeNull();
    expect(screen.queryByTestId("loading-state")).toBeNull();
  });

  it("renders loading state when loadingHistory is true", () => {
    (useChat as jest.Mock).mockReturnValue({
      state: {
        messages: [{
          id: "1",
          question: { content: "What is your name?", timestamp: 123 },
          answer: { content: "My name is Chatbot.", timestamp: 124 },
          error: true,
          loading: false
        }],
        loadingHistory: true,
        errorHistory: true,
        hasMore: true
      },
      dispatch: jest.fn(),
      loadHistory: jest.fn(),
      sendMessage: jest.fn(),
    });

    render(<Chat />);
    // Verifica che lo stato di caricamento sia presente
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
    expect(screen.queryByTestId("load-more")).toBeNull();
    expect(screen.queryByTestId("error-alert")).toBeNull();
  });

  it("calls loadHistory when 'Load more' is clicked", async () => {
    const loadHistoryMock = jest.fn();

    (useChat as jest.Mock).mockReturnValue({
      state: {
        messages: [{
          id: "1",
          question: { content: "What is your name?", timestamp: 123 },
          answer: { content: "My name is Chatbot.", timestamp: 124 },
          error: true,
          loading: false
        }],
        loadingHistory: false,
        errorHistory: false,
        hasMore: true
      },
      dispatch: jest.fn(),
      loadHistory: loadHistoryMock,
      sendMessage: jest.fn(),
    });

    render(<Chat />);

    // Verifica se il pulsante "load-more" è presente
    const loadMoreButton = screen.getByTestId("load-more");
    expect(loadMoreButton).toBeInTheDocument();

    // Simula il click su 'Load more'
    loadMoreButton.click();

    // Verifica che loadHistoryMock sia stato chiamato
    expect(loadHistoryMock).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("load-more")).toBeInTheDocument();
    expect(screen.queryByTestId("error-alert")).toBeNull();
    expect(screen.queryByTestId("loading-state")).toBeNull();
  });

  it("displays an error alert when errorHistory is true", () => {
    (useChat as jest.Mock).mockReturnValue({
      state: {
        messages: [{
          id: "1",
          question: { content: "What is your name?", timestamp: 123 },
          answer: { content: "My name is Chatbot.", timestamp: 124 },
          error: true,
          loading: false
        }],
        loadingHistory: false,
        errorHistory: true,
        hasMore: true
      },
      dispatch: jest.fn(),
      loadHistory: jest.fn(),
      sendMessage: jest.fn(),
    });

    render(<Chat />);

    // Verifica la presenza dell'alert di errore
    expect(screen.getByTestId("error-alert")).toBeInTheDocument();
    expect(screen.queryByTestId("load-more")).toBeNull();
    expect(screen.queryByTestId("loading-state")).toBeNull();
  });

  it("displays load more when thera are more messages", () => {
    (useChat as jest.Mock).mockReturnValue({
      state: {
        messages: [{
          id: "1",
          question: { content: "What is your name?", timestamp: 123 },
          answer: { content: "My name is Chatbot.", timestamp: 124 },
          error: true,
          loading: false
        }],
        loadingHistory: false,
        errorHistory: false,
        hasMore: true
      },
      dispatch: jest.fn(),
      loadHistory: jest.fn(),
      sendMessage: jest.fn(),
    });

    render(<Chat />);

    // Verifica la presenza dell'alert di errore
    expect(screen.getByTestId("load-more")).toBeInTheDocument();
    expect(screen.queryByTestId("error-alert")).toBeNull();
    expect(screen.queryByTestId("loading-state")).toBeNull();
  });
});