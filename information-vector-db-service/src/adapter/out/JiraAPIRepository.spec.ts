import { JiraAPIFacade } from './JiraAPIRepository.js';
import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { Version3Client, Version3Models } from 'jira.js';

describe('JiraAPIFacade', () => {
  let jiraAPIFacade: JiraAPIFacade;
  let mockJiraClientV3: jest.Mocked<Version3Client>;
  
  beforeEach(() => {
    // Create mock for jira.js client
    mockJiraClientV3 = {
      issueSearch: {
        searchForIssuesUsingJqlEnhancedSearch: jest.fn()
      }
    } as unknown as jest.Mocked<Version3Client>;
    
    jiraAPIFacade = new JiraAPIFacade(mockJiraClientV3);
  });
  
  describe('fetchRecentIssues', () => {
    it('should fetch issues with correct JQL when daysBack is provided', async () => {
      // Arrange
      const daysBack = 7;
      const boardId = 1;
      
      const mockIssue1: Partial<Version3Models.Issue> = { id: 'JIRA-1', key: 'JIRA-1' };
      const mockIssue2: Partial<Version3Models.Issue> = { id: 'JIRA-2', key: 'JIRA-2' };
      
      const mockResponse = {
        issues: [mockIssue1, mockIssue2] as Version3Models.Issue[],
        nextPageToken: undefined
      };
      
      mockJiraClientV3.issueSearch.searchForIssuesUsingJqlEnhancedSearch.mockResolvedValue(mockResponse);
      
      // Act
      const result = await jiraAPIFacade.fetchRecentIssues(daysBack, boardId);
      
      // Assert
      expect(mockJiraClientV3.issueSearch.searchForIssuesUsingJqlEnhancedSearch).toHaveBeenCalledWith({
        jql: `(created >= -${daysBack}d OR updated >= -${daysBack}d)`,
        fields: ['*all']
      });
      
      expect(result).toEqual([mockIssue1, mockIssue2]);
    });
    
    it('should fetch all issues when daysBack is not provided', async () => {
      // Arrange
      const mockIssue: Partial<Version3Models.Issue> = { id: 'JIRA-1', key: 'JIRA-1' };
      
      const mockResponse = {
        issues: [mockIssue] as Version3Models.Issue[],
        nextPageToken: undefined
      };
      
      mockJiraClientV3.issueSearch.searchForIssuesUsingJqlEnhancedSearch.mockResolvedValue(mockResponse);
      
      // Act
      const result = await jiraAPIFacade.fetchRecentIssues();
      
      // Assert
      expect(mockJiraClientV3.issueSearch.searchForIssuesUsingJqlEnhancedSearch).toHaveBeenCalledWith({
        jql: '(created >= -10000d OR updated >= -10000d)',
        fields: ['*all']
      });
      
      expect(result).toEqual([mockIssue]);
    });
    
    it('should handle pagination correctly', async () => {
      // Arrange
      const mockIssue1: Partial<Version3Models.Issue> = { id: 'JIRA-1', key: 'JIRA-1' };
      const mockIssue2: Partial<Version3Models.Issue> = { id: 'JIRA-2', key: 'JIRA-2' };
      
      // First page response
      const mockResponse1 = {
        issues: [mockIssue1] as Version3Models.Issue[],
        nextPageToken: 'next-page-token'
      };
      
      // Second page response
      const mockResponse2 = {
        issues: [mockIssue2] as Version3Models.Issue[],
        nextPageToken: undefined
      };
      
      mockJiraClientV3.issueSearch.searchForIssuesUsingJqlEnhancedSearch
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);
      
      // Act
      const result = await jiraAPIFacade.fetchRecentIssues(7);
      
      // Assert
      // First call without nextPageToken
      expect(mockJiraClientV3.issueSearch.searchForIssuesUsingJqlEnhancedSearch).toHaveBeenNthCalledWith(1, {
        jql: '(created >= -7d OR updated >= -7d)',
        fields: ['*all']
      });
      
      // Second call with nextPageToken
      expect(mockJiraClientV3.issueSearch.searchForIssuesUsingJqlEnhancedSearch).toHaveBeenNthCalledWith(2, {
        jql: '(created >= -7d OR updated >= -7d)',
        fields: ['*all'],
        nextPageToken: 'next-page-token'
      });
      
      // Should combine results from both pages
      expect(result).toEqual([mockIssue1, mockIssue2]);
    });
    
    it('should handle empty response gracefully', async () => {
      // Arrange
      const mockResponse = {
        issues: undefined,
        nextPageToken: undefined
      };
      
      mockJiraClientV3.issueSearch.searchForIssuesUsingJqlEnhancedSearch.mockResolvedValue(mockResponse);
      
      // Act
      const result = await jiraAPIFacade.fetchRecentIssues(7);
      
      // Assert
      expect(result).toEqual([]);
    });
    
    it('should handle API errors gracefully', async () => {
      // Arrange
      const mockError = new Error('API Error');
      
      mockJiraClientV3.issueSearch.searchForIssuesUsingJqlEnhancedSearch.mockRejectedValue(mockError);
      
      // Act & Assert
      await expect(jiraAPIFacade.fetchRecentIssues(7)).rejects.toThrow('API Error');
    });
  });
}); 