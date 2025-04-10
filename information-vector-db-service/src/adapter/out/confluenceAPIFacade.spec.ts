import { ConfluenceAPIFacade } from './ConfluenceAPIFacade.js';
import fetch from 'node-fetch';

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

describe('ConfluenceAPIFacade', () => {
  let facade: ConfluenceAPIFacade;
  const mockBaseURL = 'https://example.atlassian.net';
  const mockUsername = 'test@example.com';
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    facade = new ConfluenceAPIFacade(mockBaseURL, mockUsername, mockApiKey);
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchConfluencePages', () => {
    const mockResponse = {
      results: [
        {
          id: '123',
          title: 'Test Page',
          status: 'current',
          _links: { next: '/next-page' }
        }
      ],
      _links: { next: '/next-page' }
    };

    it('should fetch pages with default time range', async () => {
      // Arrange
      (fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse))
      );

      // Act
      const result = await facade.fetchConfluencePages();

      // Assert
      expect(result.results).toHaveLength(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('type = page'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.any(String)
          })
        })
      );
    });

    it('should fetch pages with specified time range', async () => {
      // Arrange
      const daysBack = 7;
      (fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse))
      );

      // Act
      const result = await facade.fetchConfluencePages(daysBack);

      // Assert
      expect(result.results).toHaveLength(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`lastModified >= now("-${daysBack}d")`),
        expect.any(Object)
      );
    });

    it('should handle pagination correctly', async () => {
      // Arrange
      const firstResponse = {
        results: [{ id: '1' }],
        _links: { next: '/next-page' }
      };
      const secondResponse = {
        results: [{ id: '2' }],
        _links: {}
      };

      (fetch as jest.Mock)
        .mockResolvedValueOnce(new Response(JSON.stringify(firstResponse)))
        .mockResolvedValueOnce(new Response(JSON.stringify(secondResponse)));

      // Act
      const result = await facade.fetchConfluencePages();

      // Assert
      expect(result.results).toHaveLength(2);
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('should handle API errors', async () => {
      // Arrange
      (fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

      // Act & Assert
      await expect(facade.fetchConfluencePages()).rejects.toThrow('API Error');
    });

    it('should handle non-OK responses', async () => {
      // Arrange
      (fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Not Found' }), {
          status: 404,
          statusText: 'Not Found'
        })
      );

      // Act & Assert
      await expect(facade.fetchConfluencePages()).rejects.toThrow('Failed to fetch pages: Not Found');
    });
  });
}); 