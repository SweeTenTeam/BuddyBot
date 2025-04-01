import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { JiraAPIAdapter } from './JiraAPIAdapter.js';
import { JiraAPIFacade } from './JiraAPIFacade.js';
import { JiraCmd } from '../../domain/command/JiraCmd.js';
import { Ticket } from '../../domain/business/Ticket.js';
import { JiraComment } from '../../domain/business/JiraComment.js';
import { Version3Models } from 'jira.js';

describe('JiraAPIAdapter', () => {
  let adapter: JiraAPIAdapter;
  let mockJiraAPI: jest.Mocked<JiraAPIFacade>;

  beforeEach(() => {
    mockJiraAPI = {
      fetchRecentIssues: jest.fn(),
    } as any;

    adapter = new JiraAPIAdapter(mockJiraAPI);
  });

  it('should fetch and transform tickets correctly', async () => {
    const mockIssue: Partial<Version3Models.Issue> = {
      key: 'TEST-1',
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
              content: [{ type: 'text', text: 'Test Description' }]
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [{ type: 'text', text: 'Bullet point 1' }]
                }
              ]
            }
          ]
        },
        assignee: {
          accountId: '123',
          displayName: 'John Doe',
          active: true
        },
        status: { name: 'In Progress' },
        creator: {
          accountId: '456',
          displayName: 'Jane Smith',
          active: true
        },
        priority: { name: 'High' },
        comment: {
          comments: [
            {
              body: {
                type: 'doc',
                version: 1,
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Test comment' }]
                  },
                  {
                    type: 'bulletList',
                    content: [
                      {
                        type: 'listItem',
                        content: [{ type: 'text', text: 'Comment bullet point' }]
                      }
                    ]
                  }
                ]
              },
              author: {
                displayName: 'Test Author',
                accountId: '789',
                active: true
              },
              created: '2024-01-01T00:00:00.000Z'
            }
          ]
        },
        issuelinks: [
          {
            outwardIssue: { key: 'TEST-2' }
          }
        ],
        customfield_10020: { name: 'Sprint 1' },
        customfield_10016: 5,
        duedate: '2024-12-31'
      } as any
    };

    mockJiraAPI.fetchRecentIssues.mockResolvedValue([mockIssue as Version3Models.Issue]);

    const result = await adapter.fetchTickets(new JiraCmd(1,new Date()));


    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Ticket);
    expect(result[0].title).toBe('Test Issue');
    console.log(result[0].description);
    expect(result[0].description).toBe('Test Heading\n Test Description\n Bullet point 1');
    expect(result[0].assignee).toBe('John Doe');
    expect(result[0].status).toBe('In Progress');
    expect(result[0].creator).toBe('Jane Smith');
    expect(result[0].priority).toBe('High');
    expect(result[0].relatedSprint).toBe('Sprint 1');
    expect(result[0].storyPoint).toBe('5');
    expect(result[0].expiryDate).toBe('2024-12-31');
    expect(result[0].comments).toHaveLength(1);
    expect(result[0].comments[0]).toBeInstanceOf(JiraComment);
    expect(result[0].comments[0].body).toBe('Test comment\n Comment bullet point');
    expect(result[0].comments[0].author).toBe('Test Author');
    expect(result[0].comments[0].created).toBe('2024-01-01T00:00:00.000Z');
    expect(result[0].relatedTickets).toEqual(['TEST-2']);

    expect(mockJiraAPI.fetchRecentIssues).toHaveBeenCalledTimes(1);
  });

  it('should handle missing fields gracefully', async () => {
    const mockIssue: Partial<Version3Models.Issue> = {
      key: 'TEST-1',
      fields: {
        summary: 'Test Issue',
        description: null,
        comment: {
          comments: []
        }
      } as any
    };

    mockJiraAPI.fetchRecentIssues.mockResolvedValue([mockIssue as Version3Models.Issue]);

    const result = await adapter.fetchTickets(new JiraCmd(1,new Date()));

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Test Issue');
    expect(result[0].description).toBe('No description');
    expect(result[0].assignee).toBe('No assignee');
    expect(result[0].status).toBe('No status');
    expect(result[0].creator).toBe('No creator');
    expect(result[0].priority).toBe('No priority');
    expect(result[0].relatedSprint).toBe('No sprint');
    expect(result[0].storyPoint).toBe('0');
    expect(result[0].expiryDate).toBe('No due date');
    expect(result[0].comments).toEqual([]);
    expect(result[0].relatedTickets).toEqual([]);
  });

  it('should handle complex ADF content with various node types', async () => {
    const mockIssue: Partial<Version3Models.Issue> = {
      key: 'TEST-1',
      fields: {
        summary: 'Test Issue',
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'heading',
              content: [{ type: 'text', text: 'Complex Content' }]
            },
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'First paragraph' }]
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [{ type: 'text', text: 'First item' }]
                },
                {
                  type: 'listItem',
                  content: [{ type: 'text', text: 'Second item' }]
                }
              ]
            },
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Last paragraph' }]
            }
          ]
        }
      } as any
    };

    mockJiraAPI.fetchRecentIssues.mockResolvedValue([mockIssue as Version3Models.Issue]);

    const result = await adapter.fetchTickets(new JiraCmd(1,new Date()));


    expect(result[0].description).toBe('Complex Content\n First paragraph\n First item Second item\n Last paragraph');
  });

  it('should handle API errors gracefully', async () => {
    mockJiraAPI.fetchRecentIssues.mockRejectedValue(new Error('API Error'));

    await expect(adapter.fetchTickets(new JiraCmd(
      1,
      new Date()
    ))).rejects.toThrow('Failed to fetch tickets: API Error');
  });

  it('should calculate days correctly from lastUpdate', async () => {
    const mockIssue: Partial<Version3Models.Issue> = {
      key: 'TEST-1',
      fields: {
        summary: 'Test Issue',
        description: {
          type: 'doc',
          version: 1,
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Test Description' }] }]
        }
      } as any
    };

    mockJiraAPI.fetchRecentIssues.mockResolvedValue([mockIssue as Version3Models.Issue]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    await adapter.fetchTickets(new JiraCmd(JSON.parse(JSON.stringify({
      boardId: 1,
      lastUpdate: sevenDaysAgo.toISOString()
    }))));

    expect(mockJiraAPI.fetchRecentIssues).toHaveBeenCalledWith(1, 7);
  });

  it('should use default 7 days when no lastUpdate is provided', async () => {
    const mockIssue: Partial<Version3Models.Issue> = {
      key: 'TEST-1',
      fields: {
        summary: 'Test Issue',
        description: {
          type: 'doc',
          version: 1,
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Test Description' }] }]
        }
      } as any
    };

    mockJiraAPI.fetchRecentIssues.mockResolvedValue([mockIssue as Version3Models.Issue]);

    await adapter.fetchTickets(new JiraCmd(1));

    expect(mockJiraAPI.fetchRecentIssues).toHaveBeenCalledWith(1, 7);
  });
}); 