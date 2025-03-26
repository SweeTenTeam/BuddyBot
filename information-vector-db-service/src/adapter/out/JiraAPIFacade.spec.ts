import { JiraAPIFacade } from './JiraAPIFacade.js';
import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { JiraAPIAdapter } from './JiraAPIAdapter.js';
import { JiraCmd } from '../../domain/command/JiraCmd.js';

describe('JiraAPIFacade Integration Tests', () => {
  let jiraAPI: JiraAPIFacade;
  let jiraAPIAdapter: JiraAPIAdapter;

  beforeEach(() => {
    jiraAPI = new JiraAPIFacade();
    jiraAPIAdapter = new JiraAPIAdapter(jiraAPI);
  });

  it('should fetch recent issues from the board', async () => {
    // Set a longer timeout for API calls
    jest.setTimeout(30000);

    // Calculate date 300 days ago
    const date = new Date();
    date.setDate(date.getDate() - 300);
    
    // Create JiraCmd with proper JSON structure
    const cmd = new JiraCmd(JSON.parse(JSON.stringify({
      boardId: 1,
      lastUpdate: date.toISOString()
    })));
    
    const tickets = await jiraAPIAdapter.fetchTickets(cmd);

    // Basic validation
    expect(tickets).toBeDefined();
    expect(Array.isArray(tickets)).toBe(true);
    expect(tickets.length).toBeGreaterThan(0);

    // Validate ticket structure
    const firstTicket = tickets[0];
    expect(firstTicket).toHaveProperty('title');
    expect(firstTicket).toHaveProperty('description');
    expect(firstTicket).toHaveProperty('status');
    expect(firstTicket).toHaveProperty('assignee');
    expect(firstTicket).toHaveProperty('creator');
    expect(firstTicket).toHaveProperty('priority');
    expect(firstTicket).toHaveProperty('relatedSprint');
    expect(firstTicket).toHaveProperty('storyPoint');
    expect(firstTicket).toHaveProperty('comments');
    expect(firstTicket).toHaveProperty('relatedTickets');

    // Log sample data for manual verification
    console.log('Sample Ticket:', {
      title: firstTicket.title,
      description: firstTicket.description,
      status: firstTicket.status,
      assignee: firstTicket.assignee,
      creator: firstTicket.creator,
      priority: firstTicket.priority,
      sprint: firstTicket.relatedSprint,
      storyPoints: firstTicket.storyPoint,
      commentsCount: firstTicket.comments.length,
      relatedTicketsCount: firstTicket.relatedTickets.length
    });

    // Log total count
    console.log(`Total tickets found: ${tickets.length}`);
  });
}); 