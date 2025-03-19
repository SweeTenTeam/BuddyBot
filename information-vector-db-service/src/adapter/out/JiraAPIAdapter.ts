import { Injectable } from '@nestjs/common';
import { Ticket } from '../../domain/business/Ticket.js';
import { JiraCmd } from '../../domain/command/JiraCmd.js';
import { JiraAPIFacade } from './JiraAPIFacade.js';
import { JiraAPIPort } from '../../application/port/out/JiraAPIPort.js';

@Injectable()
export class JiraAPIAdapter implements JiraAPIPort {
  private readonly jiraAPI: JiraAPIFacade;
  constructor(jiraApi: JiraAPIFacade) {
    this.jiraAPI = jiraApi;
  }

  async fetchTickets(req: JiraCmd): Promise<Ticket[]> {
    const result: Ticket[] = [];
    const boardId = req.getBoardId();
    const lastUpdate = req.getLastUpdate();
    const issues = (await this.jiraAPI.fetchIssuesForBoard(1)).issues;
    for (let i = 0; i < issues.length; i++) {
      const fields = issues[i].fields ?? null;
      if (fields !== null) {
        const comments: string[] = [];
        for (const comment of fields.comment.comments) {
          comments.push(comment.comment ?? 'No comment');
        }
        const issuelinks: string[] = [];
        for (const issuelink of fields.issuelinks) {
          issuelinks.push(issuelink.id ?? 'No issuelink');
        }
        result.push(
          new Ticket(
            fields.summary,
            fields.description ?? 'No description',
            fields.assignee ? fields.assignee.displayName : 'No assignee',
            fields.status.name,
            fields.sprint ? fields.sprint.name : 'No sprint',
            fields.epic?.name ?? 'No epic',
            fields.creator.displayName,
            fields.priority.name ?? 'No priority',
            fields.duedate ?? 'No due date',
            comments,
            issuelinks,
          ),
        );
      }
    }
    return result;
  }
}

//const jiraApi = new JiraAPIAdapter(new JiraAPIFacade());
//const json = JSON;
//json['boardId'] = 1;
//json['lastUpdate'] = '150';
//async function ziomela(): Promise<void> {
//  console.log(await jiraApi.fetchTickets(new JiraCmd(json)));
//}
//ziomela();
