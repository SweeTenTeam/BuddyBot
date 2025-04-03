import { AdapterFacade } from "@/adapters/AdapterFacade";
import { CustomError } from "@/types/CustomError";

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

      await expect(adapter.fetchHistory('123', 0)).rejects.toThrow('SERVER');
    });

    it('should handle fetch history errors', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

      await expect(adapter.fetchHistory('123', 0)).rejects.toThrow('SERVER');
    });

    it('should handle timeout and abort fetch history', async () => {
      const mockAbortError = new DOMException("The user aborted a request.", "AbortError");
      (fetch as jest.Mock).mockRejectedValue(mockAbortError);

      await expect(adapter.fetchHistory('123', 0)).rejects.toThrow('TIMEOUT');
    });

    it('should throw SERVER error for status >= 500', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(adapter.fetchHistory('123', 0)).rejects.toThrowError(new CustomError(500, "SERVER", "Errore interno del server"));
    });

    it('should throw CONNESSIONE error for status >= 400 but < 500', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({}),
      });

      await expect(adapter.fetchHistory('123', 0)).rejects.toThrowError(new CustomError(400, "CONNESSIONE", "Errore interno del server"));
    });

    it('should throw CONNESSIONE error for TypeError "Failed to fetch" in fetchHistory', async () => {
      (fetch as jest.Mock).mockRejectedValue(new TypeError("Failed to fetch"));

      await expect(adapter.fetchHistory('123', 0)).rejects.toThrowError(new CustomError(400, "CONNESSIONE", "Errore di connessione"));
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

      await expect(adapter.fetchQuestion({ question: 'Test?' })).rejects.toThrow('SERVER');
    });

    it('should handle fetch question errors', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

      await expect(adapter.fetchQuestion({ question: 'Test?' })).rejects.toThrow('SERVER');
    });

    it('should handle timeout and abort fetch question', async () => {
      const mockAbortError = new DOMException("The user aborted a request.", "AbortError");
      (fetch as jest.Mock).mockRejectedValue(mockAbortError);

      await expect(adapter.fetchQuestion({ question: 'Test?' })).rejects.toThrow('TIMEOUT');
    });
    it('should throw SERVER error for status >= 500', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(adapter.fetchQuestion({ question: 'Test?' })).rejects.toThrowError(new CustomError(501, "SERVER", "Errore interno del server"));
    });

    it('should throw CONNESSIONE error for status >= 400 but < 500', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({}),
      });

      await expect(adapter.fetchQuestion({ question: 'Test?' })).rejects.toThrowError(new CustomError(401, "CONNESSIONE", "Errore interno del server"));
    });
        it('should throw CONNESSIONE error for TypeError "Failed to fetch" in fetchQuestion', async () => {
      (fetch as jest.Mock).mockRejectedValue(new TypeError("Failed to fetch"));

      await expect(adapter.fetchQuestion({ question: 'Test?' })).rejects.toThrowError(new CustomError(401, "CONNESSIONE", "Errore di connessione"));
    });
  });
});
