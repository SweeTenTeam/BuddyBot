import { Adapter } from "@/adapters/Adapter";
import { Adaptee } from "@/adapters/Adaptee";
import { Message } from "@/types/Message";
import { CustomError } from "@/types/CustomError";
import * as generateIdModule from "@/utils/generateId";

jest.mock("@/adapters/Adaptee");

describe("Adapter", () => {
  let adapter: Adapter;
  let mockFacade: jest.Mocked<Adaptee>;

  beforeEach(() => {
    mockFacade = new Adaptee() as jest.Mocked<Adaptee>;
    adapter = new Adapter();
    (adapter as any).adaptee = mockFacade;
  });

  it("should fetch and adapt history correctly", async () => {
    const mockResponse = [
      { id: "1", question: { content: "Q1", timestamp: "12345" }, answer: { content: "A1", timestamp: "12346" }, error: 0, loading: false, lastUpdate: new Date().toISOString() },
      { id: "2", question: { content: "Q2", timestamp: "12346" }, answer: { content: "A2", timestamp: "12347" }, error: 0, loading: false, lastUpdate: new Date().toISOString() },
    ];
    mockFacade.fetchHistory.mockResolvedValue(mockResponse);
    const adapted = [
      { id: "1", question: { content: "Q1", timestamp: "12345" }, answer: { content: "A1", timestamp: "12346" }, error: 0, loading: false, lastUpdated: new Date().toISOString() },
      { id: "2", question: { content: "Q2", timestamp: "12346" }, answer: { content: "A2", timestamp: "12347" }, error: 0, loading: false, lastUpdated: new Date().toISOString() },
    ];
    const result = await adapter.requestHistory("1", 0);
    expect(result).toEqual(adapted);
  });

  it("should throw an error if fetching history fails", async () => {
    mockFacade.fetchHistory.mockRejectedValue(new Error("Error fetching"));
    await expect(adapter.requestHistory("1", 0)).rejects.toThrow("SERVER");
  });

  it("should fetch and adapt an answer correctly", async () => {
    const question: Message = { content: "What is AI?", timestamp: "12345" };
    const mockResponse = { id: "2", answer: { content: "Artificial Intelligence", timestamp: "12346" } };
    mockFacade.fetchQuestion.mockResolvedValue(mockResponse);

    const result = await adapter.requestAnswer(question);
    expect(result).toEqual({
      id: "2",
      answer: { content: "Artificial Intelligence", timestamp: "12346" },
    });
  });

  it("should throw an error with a specific message if fetching an answer fails", async () => {
    const question: Message = { content: "What is AI?", timestamp: "12345" };
    mockFacade.fetchQuestion.mockRejectedValue(new Error("Error fetching"));
    await expect(adapter.requestAnswer(question)).rejects.toThrow("SERVER");
  });

  it("should generate an id if data.id is missing", async () => {
    const mockGenerateId = jest.spyOn(generateIdModule, "generateId").mockReturnValue("generated-id");

    const mockData = { question: { content: "What is AI?", timestamp: "12345" }, answer: { content: "Artificial Intelligence", timestamp: "12346" }, error: false, loading: false, lastUpdate: "54321" };
    
    const adapted = adapter["adaptQuestionAnswer"](mockData);

    expect(adapted.id).toBe("generated-id");
    expect(mockGenerateId).toHaveBeenCalledTimes(1);
    expect(adapted.lastUpdated).toBe("54321");
  });

  it("should rethrow CustomError if thrown by fetchHistory", async () => {
    const customError = new CustomError(404, "NOT_FOUND", "Not found");
    mockFacade.fetchHistory.mockRejectedValue(customError);

    await expect(adapter.requestHistory("1", 0)).rejects.toThrow(customError);
  });

  it("should rethrow CustomError if thrown by fetchQuestion", async () => {
    const customError = new CustomError(403, "FORBIDDEN", "Forbidden");
    mockFacade.fetchQuestion.mockRejectedValue(customError);

    const question = { content: "Test question", timestamp: "12345" };

    await expect(adapter.requestAnswer(question)).rejects.toThrow(customError);
  });

});
