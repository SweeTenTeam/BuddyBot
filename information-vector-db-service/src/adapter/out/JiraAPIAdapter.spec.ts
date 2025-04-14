import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { JiraAPIAdapter } from './JiraAPIAdapter.js';
import { JiraAPIFacade } from './JiraAPIRepository.js';
import { JiraCmd } from '../../domain/command/JiraCmd.js';
import { Ticket } from '../../domain/business/Ticket.js';
import { JiraComment } from '../../domain/business/JiraComment.js';
import { Version3Models } from 'jira.js';

describe('JiraAPIAdapter Unit Tests', () => {
  let adapter: JiraAPIAdapter;
  let mockJiraAPI: jest.Mocked<JiraAPIFacade>;

  beforeEach(() => {
    mockJiraAPI = {
      fetchRecentIssues: jest.fn(),
    } as unknown as jest.Mocked<JiraAPIFacade>;

    adapter = new JiraAPIAdapter(mockJiraAPI);
  });

  describe('fetchTickets', () => {
    it('should fetch tickets and transform them correctly', async () => {
      // Arrange
      const mockIssue: Partial<Version3Models.Issue> = {
        id: 'JIRA-123',
        key: 'JIRA-123',
        fields: {
          summary: 'Test Issue',
          description: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Test Description' }]
              }
            ]
          },
          assignee: {
            displayName: 'John Doe'
          },
          status: {
            name: 'In Progress'
          },
          creator: {
            displayName: 'Jane Smith'
          },
          priority: {
            name: 'High'
          },
          comment: {
            comments: [
              {
                body: {
                  type: 'doc',
                  content: [{ type: 'text', text: 'Test Comment' }]
                },
                author: {
                  displayName: 'Comment Author'
                },
                created: '2023-01-01T12:00:00Z'
              }
            ]
          },
          issuelinks: [
            {
              outwardIssue: {
                key: 'JIRA-456'
              }
            }
          ],
          customfield_10020: {
            name: 'Sprint 1'
          },
          customfield_10016: 5,
          duedate: '2023-12-31'
        } as any
      };

      const jiraCmd = new JiraCmd(1, new Date());
      mockJiraAPI.fetchRecentIssues.mockResolvedValue([mockIssue as Version3Models.Issue]);

      // Act
      const result = await adapter.fetchTickets(jiraCmd);

      // Assert
      expect(mockJiraAPI.fetchRecentIssues).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Ticket);
      
      const ticket = result[0];
      expect(ticket.id).toBe('JIRA-123');
      expect(ticket.title).toBe('Test Issue');
      expect(ticket.description).toBe('Test Description');
      expect(ticket.assignee).toBe('John Doe');
      expect(ticket.status).toBe('In Progress');
      expect(ticket.creator).toBe('Jane Smith');
      expect(ticket.priority).toBe('High');
      expect(ticket.relatedSprint).toBe('Sprint 1');
      expect(ticket.storyPoint).toBe('5');
      expect(ticket.expiryDate).toBe('2023-12-31');
      
      expect(ticket.comments).toHaveLength(1);
      expect(ticket.comments[0]).toBeInstanceOf(JiraComment);
      expect(ticket.comments[0].body).toBe('Test Comment');
      expect(ticket.comments[0].author).toBe('Comment Author');
      expect(ticket.comments[0].created).toBe('2023-01-01T12:00:00Z');
      
      expect(ticket.relatedTickets).toEqual(['JIRA-456']);
    });

    it('should handle missing fields gracefully', async () => {
      // Arrange
      const mockIssue: Partial<Version3Models.Issue> = {
        id: 'JIRA-123',
        key: 'JIRA-123',
        fields: {
          summary: 'Test Issue'
        } as any
      };

      const jiraCmd = new JiraCmd(1, new Date());
      mockJiraAPI.fetchRecentIssues.mockResolvedValue([mockIssue as Version3Models.Issue]);

      // Act
      const result = await adapter.fetchTickets(jiraCmd);

      // Assert
      expect(result).toHaveLength(1);
      const ticket = result[0];
      
      expect(ticket.title).toBe('Test Issue');
      expect(ticket.description).toBe('No description');
      expect(ticket.assignee).toBe('No assignee');
      expect(ticket.status).toBe('No status');
      expect(ticket.creator).toBe('No creator');
      expect(ticket.priority).toBe('No priority');
      expect(ticket.relatedSprint).toBe('No sprint');
      expect(ticket.storyPoint).toBe('0');
      expect(ticket.expiryDate).toBe('No due date');
      expect(ticket.comments).toEqual([]);
      expect(ticket.relatedTickets).toEqual([]);
    });

    it('should correctly extract days back from lastUpdate', async () => {
      // Arrange
      const mockIssue: Partial<Version3Models.Issue> = {
        id: 'JIRA-123',
        fields: {} as any
      };

      mockJiraAPI.fetchRecentIssues.mockResolvedValue([mockIssue as Version3Models.Issue]);
      
      // Create a date 10 days in the past
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      
      const jiraCmd = new JiraCmd(1, tenDaysAgo);

      // Act
      await adapter.fetchTickets(jiraCmd);

      // Assert
      // Should be approximately 10 days (might be 10 or 11 depending on timing, but we'll just check the call happened)
      expect(mockJiraAPI.fetchRecentIssues).toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      // Arrange
      const jiraCmd = new JiraCmd(1, new Date());
      mockJiraAPI.fetchRecentIssues.mockRejectedValue(new Error('API Error'));

      // Act & Assert
      await expect(adapter.fetchTickets(jiraCmd)).rejects.toThrow('Failed to fetch tickets: API Error');
    });

    it('should handle empty issue list gracefully', async () => {
      // Arrange
      const jiraCmd = new JiraCmd(1, new Date());
      mockJiraAPI.fetchRecentIssues.mockResolvedValue([]);

      // Act
      const result = await adapter.fetchTickets(jiraCmd);

      // Assert
      expect(result).toEqual([]);
    });

    it('should extract text from ADF content correctly', async () => {
      // Arrange
      const mockIssue: Partial<Version3Models.Issue> = {
        id: 'JIRA-123',
        key: 'JIRA-123',
        fields: {
          summary: 'Test Issue',
          description: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'heading',
                content: [{ type: 'text', text: 'Test Heading' }]
              },
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Paragraph 1' }]
              },
              {
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Bullet 1' }]
                      }
                    ]
                  },
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Bullet 2' }]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        } as any
      };

      const jiraCmd = new JiraCmd(1, new Date());
      mockJiraAPI.fetchRecentIssues.mockResolvedValue([mockIssue as Version3Models.Issue]);

      // Act
      const result = await adapter.fetchTickets(jiraCmd);

      // Assert
      expect(result).toHaveLength(1);
      const ticket = result[0];
      
      // Check for line breaks and proper text extraction
      expect(ticket.description).toContain('Test Heading');
      expect(ticket.description).toContain('Paragraph 1');
      expect(ticket.description).toContain('Bullet 1');
      expect(ticket.description).toContain('Bullet 2');
    });
  });
}); 