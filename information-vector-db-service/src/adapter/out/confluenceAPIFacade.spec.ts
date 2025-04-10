import { ConfluenceAPIFacade } from './ConfluenceAPIFacade.js';
import { jest } from '@jest/globals';
import fetch, { Headers, Response } from 'node-fetch';

// Mock the node-fetch module
jest.mock('node-fetch', async () => {
  const actual = await import('node-fetch');
  return {
    __esModule: true,
    default: jest.fn(),
    Headers: actual.Headers,
    Response: actual.Response,
  };
});

// Variable to hold the properly typed mock function
let fetchMock: jest.MockedFunction<typeof fetch>;

// Initialize the mock function variable before tests run
beforeAll(async () => {
  const mockedModule = await jest.requireMock('node-fetch') as {
    default: typeof fetch;
    Headers: typeof Headers;
    Response: typeof Response;
  };
  fetchMock = mockedModule.default as jest.MockedFunction<typeof fetch>;
});

describe('ConfluenceAPIFacade', () => {
  let facade: ConfluenceAPIFacade;
  const mockBaseURL = 'https://example.atlassian.net';
  const mockUsername = 'test@example.com';
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    if (!fetchMock) {
      throw new Error('fetchMock not initialized. Check beforeAll setup.');
    }
    facade = new ConfluenceAPIFacade(mockBaseURL, mockUsername, mockApiKey);
    fetchMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchConfluencePages', () => {
    const mockPageData = {
      results: [
        {
          id: '123',
          title: 'Test Page',
          status: 'current',
          _links: { next: '/rest/api/content?start=20' }
        }
      ],
      _links: { next: '/rest/api/content?start=20' }
    };

    const mockSuccessResponse = (data: any): Response => {
      const headersInit: { [key: string]: string } = {};
      const linkHeader = data._links?.next ? `<${mockBaseURL}${data._links.next}>; rel="next"` : undefined;
      if (linkHeader) {
        headersInit['Link'] = linkHeader;
      }

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => data,
        headers: new Headers(headersInit),
        text: async () => JSON.stringify(data),
        body: null as any,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob(),
        buffer: async () => Buffer.from(''),
        clone: () => mockSuccessResponse(data),
        formData: async () => new FormData(),
        redirect: () => new Response(),
        type: 'default' as ResponseType,
        url: '',
        redirected: false,
        size: 0,
      };

      return mockResponse as unknown as Response;
    };

    const mockErrorResponse = (status: number, statusText: string, errorBody: any): Response => {
      const mockResponse = {
        ok: false,
        status: status,
        statusText: statusText,
        json: async () => errorBody,
        headers: new Headers(),
        text: async () => JSON.stringify(errorBody),
        body: null as any,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob(),
        buffer: async () => Buffer.from(''),
        clone: () => mockErrorResponse(status, statusText, errorBody),
        formData: async () => new FormData(),
        redirect: () => new Response(),
        type: 'default' as ResponseType,
        url: '',
        redirected: false,
        size: 0,
      };

      return mockResponse as unknown as Response;
    };

    it('should fetch pages with default time range', async () => {
      // Arrange
      fetchMock.mockResolvedValueOnce(mockSuccessResponse(mockPageData));

      // Act
      const result = await facade.fetchConfluencePages();

      // Assert
      expect(result.results).toHaveLength(1);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(`${mockBaseURL}/rest/api/content/search?cql=type%20%3D%20page`),
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
      fetchMock.mockResolvedValueOnce(mockSuccessResponse(mockPageData));

      // Act
      const result = await facade.fetchConfluencePages(daysBack);

      // Assert
      expect(result.results).toHaveLength(1);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(`lastModified%20%3E%3D%20now(%22-${daysBack}d%22)`),
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

      fetchMock
        .mockResolvedValueOnce(mockSuccessResponse(firstResponseData))
        .mockResolvedValueOnce(mockSuccessResponse(secondResponseData));

      // Act
      const result = await facade.fetchConfluencePages();

      // Assert
      expect(result.results).toHaveLength(2);
      expect(result.results.map(r => r.id)).toEqual(['1', '2']);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        `${mockBaseURL}/rest/api/content?start=20`,
        expect.any(Object)
      );
    });

    it('should handle API errors (network level)', async () => {
      // Arrange
      const networkError = new Error('Network Error');
      fetchMock.mockRejectedValueOnce(networkError);

      // Act & Assert
      await expect(facade.fetchConfluencePages()).rejects.toThrow(networkError);
    });

    it('should handle non-OK responses (API level error)', async () => {
      // Arrange
      fetchMock.mockResolvedValueOnce(
        mockErrorResponse(404, 'Not Found', { error: 'Page not found' })
      );

      // Act & Assert
      await expect(facade.fetchConfluencePages()).rejects.toThrow('Failed to fetch pages: Not Found');
    });
  });
}); 