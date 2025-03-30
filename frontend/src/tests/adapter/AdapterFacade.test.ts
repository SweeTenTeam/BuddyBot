import { AdapterFacade } from "@/adapters/AdapterFacade";

// Mock per la funzione fetch
global.fetch = jest.fn();

describe('AdapterFacade', () => {
  let adapter: AdapterFacade;

  beforeEach(() => {
    adapter = new AdapterFacade();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchHistory', () => {
    it('should fetch history successfully', async () => {
      const mockResponse = [{ id: 1, message: "Test message" }];
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await adapter.fetchHistory('123', 0);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost/api/get-storico?id=123&num=0',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Error" }),
      });

      await expect(adapter.fetchHistory('123', 0)).rejects.toThrow('Error fetching history');
    });

    it('should handle fetch errors', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

      await expect(adapter.fetchHistory('123', 0)).rejects.toThrow('Error fetching history');
    });

    it('should handle timeout and abort fetch history', async () => {
      const mockAbortError = new DOMException("The user aborted a request.", "AbortError");
      (fetch as jest.Mock).mockRejectedValue(mockAbortError);

      await expect(adapter.fetchHistory('123', 0)).rejects.toThrow('Error fetching history');
    });
  });

  describe('fetchQuestion', () => {
    it('should send question successfully', async () => {
      const mockResponse = { answer: "Test answer" };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await adapter.fetchQuestion({ question: 'Test?' });

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost/api/get-risposta',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ question: 'Test?' }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Error" }),
      });

      await expect(adapter.fetchQuestion({ question: 'Test?' })).rejects.toThrow('Error sending message');
    });

    it('should handle fetch errors', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

      await expect(adapter.fetchQuestion({ question: 'Test?' })).rejects.toThrow('Error sending message');
    });

    it('should handle timeout and abort fetch question', async () => {
      const mockAbortError = new DOMException("The user aborted a request.", "AbortError");
      (fetch as jest.Mock).mockRejectedValue(mockAbortError);

      await expect(adapter.fetchQuestion({ question: 'Test?' })).rejects.toThrow('Error sending message');
    });
  });
});
