import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { ConfluenceAPIAdapter } from './ConfluenceAPIAdapter.js';
import { ConfluenceAPIFacade } from './ConfluenceAPIFacade.js';
import { ConfluenceCmd } from '../../domain/command/ConfluenceCmd.js';
import { ConfluenceDocument } from '../../domain/business/ConfluenceDocument.js';

describe('ConfluenceAPIAdapter', () => {
  let adapter: ConfluenceAPIAdapter;
  let mockConfluenceAPI: jest.Mocked<ConfluenceAPIFacade>;

  beforeEach(() => {
    mockConfluenceAPI = {
      fetchConfluencePages: jest.fn(),
    } as any;

    adapter = new ConfluenceAPIAdapter(mockConfluenceAPI);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchDocuments', () => {
    it('should fetch and transform documents correctly', async () => {
      const mockPagesResponse = {
        results: [
          {
            id: '123',
            title: 'Test Document',
            status: 'current',
            history: {
              createdBy: { displayName: 'John Doe' },
              ownedBy: { displayName: 'Jane Smith' }
            },
            space: { id: 456 },
            body: { storage: { value: 'Test content' } }
          }
        ]
      };

      mockConfluenceAPI.fetchConfluencePages.mockResolvedValue(mockPagesResponse);

      const result = await adapter.fetchDocuments(new ConfluenceCmd());

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ConfluenceDocument);
      expect(result[0].getId()).toBe('123');
      expect(result[0].getTitle()).toBe('Test Document');
      expect(result[0].getStatus()).toBe('current');
      expect(result[0].getAuthor()).toBe('John Doe');
      expect(result[0].getOwner()).toBe('Jane Smith');
      expect(result[0].getSpace()).toBe(456);
      expect(result[0].getContent()).toBe('Test content');

      expect(mockConfluenceAPI.fetchConfluencePages).toHaveBeenCalledTimes(1);
    });

    it('should handle missing document data gracefully', async () => {
      const mockPagesResponse = {
        results: [
          {
            id: '123',
            title: 'Test Document',
            history: {
              createdBy: { displayName: 'John Doe' }
            }
          }
        ]
      };

      mockConfluenceAPI.fetchConfluencePages.mockResolvedValue(mockPagesResponse);

      const result = await adapter.fetchDocuments(new ConfluenceCmd());

      expect(result).toHaveLength(1);
      expect(result[0].getId()).toBe('123');
      expect(result[0].getTitle()).toBe('Test Document');
      expect(result[0].getStatus()).toBe(undefined);
      expect(result[0].getAuthor()).toBe('John Doe');
      expect(result[0].getOwner()).toBe(undefined);
      expect(result[0].getSpace()).toBe(undefined);
      expect(result[0].getContent()).toBe(undefined);
    });

    it('should handle API errors gracefully', async () => {
      mockConfluenceAPI.fetchConfluencePages.mockRejectedValue(new Error('API Error'));

      await expect(adapter.fetchDocuments(new ConfluenceCmd())).rejects.toThrow('API Error');
    });

  });
});
