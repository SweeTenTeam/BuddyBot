import { Injectable } from '@nestjs/common';
import { Ticket } from '../../domain/business/Ticket.js';
import { JiraComment } from '../../domain/business/JiraComment.js';
import { JiraCmd } from '../../domain/command/JiraCmd.js';
import { JiraAPIFacade } from './JiraAPIRepository.js';
import { JiraAPIPort } from '../../application/port/out/JiraAPIPort.js';
import { ADFNode } from './utils/ADFNode.js';

@Injectable()
export class JiraAPIAdapter implements JiraAPIPort {
  private readonly jiraAPI: JiraAPIFacade;
  constructor(jiraApi: JiraAPIFacade) {
    this.jiraAPI = jiraApi;
  }

  private extractTextFromADF(node: ADFNode): string {
    if (!node) return '';

    if (node.type === 'text' && node.text) {
      return node.text;
    }

    if (node.content && Array.isArray(node.content)) {
      const text = node.content
        .map(child => this.extractTextFromADF(child))
        .filter(text => text)
        .join(' ');

      switch (node.type) {
        case 'heading':
        case 'paragraph':
        case 'bulletList':
          return text + '\n';
        default:
          return text;
      }
    }

    return '';
  }

  private extractTextFromADFContent(content: any, defaultValue: string = ''): string {
    if (!content) return defaultValue;

    if (typeof content === 'string') {
      return content;
    }

    if (content.type === 'doc' && content.content) {
      const text = this.extractTextFromADF(content);
      return text.trim() || defaultValue;
    }

    return defaultValue;
  }

  async fetchTickets(req: JiraCmd): Promise<Ticket[]> {
    try {
      const result: Ticket[] = [];
      const boardId = req.getBoardId();
      const lastUpdate = req.lastUpdate;
      const daysBack = lastUpdate ? 
        Math.ceil((new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)) : undefined;//if not last update pass undefined and it will fetch all the issues

      const issues = await this.jiraAPI.fetchRecentIssues(daysBack);

      for (const issue of issues) {
        const fields = issue.fields;
        if (!fields) continue;

        const comments: JiraComment[] = fields.comment?.comments?.map(comment => {
          const body = this.extractTextFromADFContent(comment.body, 'No comment');
          return new JiraComment(
            body,
            comment.author?.displayName || 'Unknown Author',
            comment.created || new Date().toISOString()
          );
        }) || [];

        const relatedTickets: string[] = fields.issuelinks?.map(link => 
          link.outwardIssue?.key || link.inwardIssue?.key || 'No related ticket'
        ) || [];

        const sprint = fields.customfield_10020?.name || 'No sprint';
        const storyPoints = fields.customfield_10016?.toString() || '0';

        const id = issue.id;
        const title = typeof fields.summary === 'string' ? fields.summary : 'No title';
        const description = this.extractTextFromADFContent(fields.description, 'No description');
        const assignee = fields.assignee?.displayName || 'No assignee';
        const status = fields.status?.name || 'No status';
        const creator = fields.creator?.displayName || 'No creator';
        const priority = fields.priority?.name || 'No priority';
        const dueDate = fields.duedate || 'No due date';

        result.push(
          new Ticket(
            id,
            title,
            description,
            assignee,
            status,
            sprint,
            storyPoints,
            creator,
            priority,
            dueDate,
            comments,
            relatedTickets
          )
        );
      }
      return result;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw new Error(`Failed to fetch tickets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
