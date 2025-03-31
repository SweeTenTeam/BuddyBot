import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatWindow from '@/components/ChatWindow';
import { Adapter } from '@/adapters/Adapter';
import { ChatProvider } from '@/providers/chatProvider';

jest.mock('@/adapters/Adapter'); // Mock the Adapter class

describe('ChatWindow', () => {
  let requestHistoryMock: jest.Mock;
  let requestAnswerMock: jest.Mock;

  beforeEach(() => {
    // Mock the methods of Adapter
    requestHistoryMock = jest.fn().mockResolvedValue([]);
    requestAnswerMock = jest.fn().mockResolvedValue({ answer: { content: 'Mock Answer', timestamp: new Date().toISOString() }, id: '123' });

    // Mock the Adapter class constructor and its methods
    (Adapter as jest.Mock).mockImplementation(() => {
      return {
        requestHistory: requestHistoryMock,
        requestAnswer: requestAnswerMock,
        adaptMessage: jest.fn(),
        adaptQuestionAnswer: jest.fn(),
        adaptQuestionAnswerArray: jest.fn(),
        adaptMessageToJSON: jest.fn(),
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clean up mocks after each test
  });

  it('should create Adapter once when ChatWindow is rendered', async () => {
    await act(async () => {
      render(<ChatWindow />);
    });

    // Ensure the Adapter constructor is called once
    expect(Adapter).toHaveBeenCalledTimes(1);
  });

  it('should render Chat and InputForm components', async () => {
    await act(async () => {
      render(<ChatWindow />);
    });

    // Wait for the components to render
    await waitFor(() => {
      expect(screen.getByTestId('chat-component')).toBeInTheDocument();
      expect(screen.getByTestId('input-form')).toBeInTheDocument();
    });
  });
});