import { Adapter } from "@/adapters/Adapter";
import { AdapterFacade } from "@/adapters/AdapterFacade";
import { Message } from "@/types/Message";
import { QuestionAnswer } from "@/types/QuestionAnswer";
import * as generateIdModule from "@/utils/generateId";

jest.mock("@/adapters/AdapterFacade");

describe("Adapter", () => {
  let adapter: Adapter;
  let mockFacade: jest.Mocked<AdapterFacade>;

  beforeEach(() => {
    mockFacade = new AdapterFacade() as jest.Mocked<AdapterFacade>;
    adapter = new Adapter();
    (adapter as any).adapterFacade = mockFacade;
  });

  it("should fetch and adapt history correctly", async () => {
    const mockResponse = [
      { id: "1", question: { content: "Q1", timestamp: "12345" }, answer: { content: "A1", timestamp: "12346" }, error: false, loading: false },
      { id: "2", question: { content: "Q2", timestamp: "12346" }, answer: { content: "A2", timestamp: "12347" }, error: false, loading: false },
    ];
    mockFacade.fetchHistory.mockResolvedValue(mockResponse);

    const result = await adapter.requestHistory("1", 0);
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if fetching history fails", async () => {
    mockFacade.fetchHistory.mockRejectedValue(new Error("Error fetching"));
    await expect(adapter.requestHistory("1", 0)).rejects.toThrow("Error fetching history");
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
    await expect(adapter.requestAnswer(question)).rejects.toThrow("Error fetching history");
  });

  it("should generate an id if data.id is missing", async () => {
    const mockGenerateId = jest.spyOn(generateIdModule, "generateId").mockReturnValue("generated-id");

    const mockData = { question: { content: "What is AI?", timestamp: "12345" }, answer: { content: "Artificial Intelligence", timestamp: "12346" }, error: false, loading: false };
    
    const adapted = adapter["adaptQuestionAnswer"](mockData);

    expect(adapted.id).toBe("generated-id");
    expect(mockGenerateId).toHaveBeenCalledTimes(1);
  });

});
