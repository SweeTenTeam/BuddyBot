import { ConfluenceAPIFacade } from './ConfluenceAPIRepository.js';
import { jest } from '@jest/globals';


// Direct mock of the global fetch function
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

// Mock btoa function if needed
global.btoa = (str) => Buffer.from(str).toString('base64');

describe('ConfluenceAPIFacade', () => {
  let facade: ConfluenceAPIFacade;
  const mockBaseURL = 'https://example.atlassian.net';
  const mockUsername = 'test@example.com';
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    facade = new ConfluenceAPIFacade(mockBaseURL, mockUsername, mockApiKey);
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchConfluencePages', () => {
    const createMockResponse = (data: any, status = 200, ok = true) => {
      const headersInit: { [key: string]: string } = {};
      
      // Add link header if there's a next link
      if (data._links?.next) {
        headersInit['Link'] = `<${mockBaseURL}${data._links.next}>; rel="next"`;
      }
      
      return {
        ok,
        status,
        statusText: ok ? 'OK' : 'Error',
        json: async () => data,
        headers: new Headers(headersInit),
        redirected: false,
        type: 'default' as ResponseType,
        url: '',
        clone: () => createMockResponse(data, status, ok),
        body: null as any,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob(),
        buffer: async () => Buffer.from(''),
        formData: async () => new FormData(),
        text: async () => JSON.stringify(data),
      } as unknown as Response;
    };

    it('should fetch pages with default time range', async () => {
      // Arrange
      const mockPageData = {
        results: [
          {
            id: '123',
            title: 'Test Page',
            status: 'current',
          }
        ],
        _links: {}
      };
      
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPageData));

      // Act
      const result = await facade.fetchConfluencePages();

      // Assert
      expect(result.results).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`${mockBaseURL}/rest/api/content/search?cql=type = page`),
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
      const mockPageData = {
        results: [{ id: '123' }],
        _links: {}
      };
      
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPageData));

      // Act
      const result = await facade.fetchConfluencePages(daysBack);

      // Assert
      expect(result.results).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`lastModified >= now("-${daysBack}d")`),
        expect.any(Object)
      );
    });

    it('should handle pagination correctly', async () => {
      // Arrange
      const firstResponseData = {
        results: [{ id: '1' }],
        _links: { next: '/rest/api/content?start=20' }
      };
      
      const secondResponseData = {
        results: [{ id: '2' }],
        _links: {} // No next link
      };

      mockFetch
        .mockResolvedValueOnce(createMockResponse(firstResponseData))
        .mockResolvedValueOnce(createMockResponse(secondResponseData));

      // Act
      const result = await facade.fetchConfluencePages();

      // Assert
      expect(result.results).toHaveLength(2);
      expect(result.results.map(r => r.id)).toEqual(['1', '2']);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        `${mockBaseURL}/rest/api/content?start=20`,
        expect.any(Object)
      );
    });

    it('should handle API errors (network level)', async () => {
      // Arrange
      const networkError = new Error('Network Error');
      mockFetch.mockRejectedValueOnce(networkError);

      // Act & Assert
      await expect(facade.fetchConfluencePages()).rejects.toThrow(networkError);
    });

    it('should handle non-OK responses (API level error)', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ error: 'Page not found' }, 404, false)
      );

      // Act & Assert
      await expect(facade.fetchConfluencePages()).rejects.toThrow('Failed to fetch pages: Error');
    });
  });
}); 