import { Injectable } from "@nestjs/common";
import { JiraCmd } from "../../domain/JiraCmd";
import { Ticket } from "../../domain/Ticket";
import { JiraAPIFacade } from "./JiraAPIFacade";
import { JiraAPIPort } from "src/application/port/out/JiraAPIPort";

@Injectable
export class JiraAPIAdapter implements JiraAPIPort {
  private readonly jiraAPI: JiraAPIFacade;
  constructor(jiraApi: JiraAPIFacade) {
    this.jiraAPI = jiraApi;
  }

  async fetchTickets(req: JiraCmd): Promise<Ticket[]> {
    let result: Ticket[] = [];
    let boardId = req.getBoardId();
    let lastUpdate = req.getLastUpdate();
    //const issues = await this.jiraAPI.fetchIssuesForBoard(boardId, lastUpdate)
    //for (let i = 0; i < issues.length; i++) {
    //  let fields = issues[i].fields;
    //  result.push(
    //    new Ticket(
    //      fields.summary,
    //      fields.description,
    //      fields.assignee ? fields.assignee.displayName : 'No assignee',
    //      fields.status.name,
    //      fields.sprint,
    //      fields.epic || 'No epic',
    //      fields.creator.displayName,
    //      fields.priority.name,
    //      fields.duedate,
    //      fields.comment.comments,
    //      fields.issuelinks,
    //    ),
    //  );
    //}
    return result;
  }
}
