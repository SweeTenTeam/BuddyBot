import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import '@testing-library/jest-dom';
import { ChatProvider, useChat } from "@/providers/chatProvider";
import { generateId } from "@/utils/generateId";
import { QuestionAnswer } from "@/types/QuestionAnswer";

// Mock della funzione di adapter
jest.mock("@/utils/generateId", () => ({
    generateId: jest.fn(() => "test-id"),
}));

// Mock dell'adapter passato come prop
const mockAdapter = {
    requestHistory: jest.fn(),
    requestAnswer: jest.fn(),
};

const TestComponent = () => {
    const { sendMessage } = useChat();
    return <button onClick={() => sendMessage("Test message")}>Send Message</button>;
};

describe("ChatProvider", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders children correctly", async () => {
        await act(async () => {
            render(
                <ChatProvider adapter={mockAdapter}>
                    <div>Test Child</div>
                </ChatProvider>
            );
        });
        expect(screen.getByText("Test Child")).toBeInTheDocument();
    });

    it("loads message history on mount", async () => {
        mockAdapter.requestHistory.mockResolvedValueOnce([]);
        
        await act(async () => {
            render(
                <ChatProvider adapter={mockAdapter}>
                    <div>Test Child</div>
                </ChatProvider>
            );
        });

        await waitFor(() => {
            expect(mockAdapter.requestHistory).toHaveBeenCalledTimes(1);
        });
    });

    it("sends message and handles response", async () => {
        const botResponse = { answer: { content: "Test bot response", timestamp: new Date().toISOString() }, id: "bot-id" };

        mockAdapter.requestAnswer.mockResolvedValueOnce(botResponse);

        await act(async () => {
            render(
                <ChatProvider adapter={mockAdapter}>
                    <TestComponent />
                </ChatProvider>
            );
        });

        await act(async () => {
            fireEvent.click(screen.getByText("Send Message"));
        });

        await waitFor(() => {
            expect(mockAdapter.requestAnswer).toHaveBeenCalledWith({ content: "Test message", timestamp: expect.any(String) });
        });
    });

    it("handles error when sending message", async () => {
        const message = "Test message";

        mockAdapter.requestAnswer.mockRejectedValueOnce(new Error("Error"));

        await act(async () => {
            render(
                <ChatProvider adapter={mockAdapter}>
                    <TestComponent />
                </ChatProvider>
            );
        });

        await act(async () => {
            fireEvent.click(screen.getByText("Send Message"));
        });

        await waitFor(() => {
            expect(mockAdapter.requestAnswer).toHaveBeenCalledWith({ content: message, timestamp: expect.any(String) });
        });
    });

    it("handles loadHistory error inside act", async () => {
        mockAdapter.requestHistory.mockRejectedValueOnce(new Error("History load error"));

        await act(async () => {
            render(
                <ChatProvider adapter={mockAdapter}>
                    <div>Test Child</div>
                </ChatProvider>
            );
        });

        await waitFor(() => {
            expect(mockAdapter.requestHistory).toHaveBeenCalledTimes(1);
        });
    });

    it("throws an error if useChat is used outside ChatProvider", () => {
        const TestComponent = () => {
            useChat();
            return null;
        };

        expect(() => {
            render(<TestComponent />);
        }).toThrowError("useChat must be used within a ChatProvider");
    });
    
    it("loads older messages when there are messages in the state", async () => {
        const mockMessages: QuestionAnswer[] = [
            { 
                id: "1", 
                question: { content: "Previous question", timestamp: "12345" }, 
                answer: { content: "Previous answer", timestamp: "12346" }, 
                error: false, 
                loading: false 
            },
        ];
        const mockHistoryResponse: QuestionAnswer[] = [
            { 
                id: "2", 
                question: { content: "New question", timestamp: "12347" }, 
                answer: { content: "New answer", timestamp: "12348" }, 
                error: false, 
                loading: false 
            },
        ];
        mockAdapter.requestHistory.mockResolvedValue(mockMessages);
        const TestComponent = () => {
            const { loadHistory } = useChat();
            return <button onClick={loadHistory}>Load History</button>;
        };
    
        await act(async () => {
            render(
                <ChatProvider adapter={mockAdapter}>
                    <TestComponent />
                </ChatProvider>
            );
        });
        await waitFor(() => {
            expect(mockAdapter.requestHistory).toHaveBeenCalledWith("", 10);
            mockAdapter.requestHistory.mockResolvedValue(mockHistoryResponse);
        });
        await act(async () => {
            fireEvent.click(screen.getByText("Load History"));
        });
        await waitFor(() => {
            expect(mockAdapter.requestHistory).toHaveBeenCalledWith("1", 10);
        });
        await waitFor(() => {
            expect(mockAdapter.requestHistory).toHaveBeenCalledTimes(2);
        });
    });
    
    
});
