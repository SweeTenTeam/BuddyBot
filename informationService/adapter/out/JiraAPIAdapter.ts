import { JiraAPIPort } from "../../application/port/out/JiraApiPort";
import { JiraCmd } from "../../domain/JiraCmd";
import { Ticket } from "../../domain/Ticket";
import { JiraAPIFacade } from "./JiraAPIFacade";

export class JiraAPIAdapter implements JiraAPIPort {
  private jiraAPI: JiraAPIFacade;
  constructor() {
    this.jiraAPI = new JiraAPIFacade();
  }
  fetchTicket(req: JiraCmd): Ticket[] {
    this.jiraAPI.fetchTicket("KAN-1");
    let tickets = Ticket[2];
    return tickets;
  }
  async fetchIssues(boardId: string, lastUpdate: string): Promise<Ticket[]> {
    let result: Ticket[] = [];
    const issues = await this.jiraAPI.fetchIssuesForBoard(boardId, "1");
    //console.log(issues);
    for (let i = 0; i < issues.length; i++) {
      let fields = issues[i].fields;
      result.push(
        new Ticket(
          fields.summary,
          fields.description,
          fields.assignee,
          fields.status.name,
          fields.sprint,
          fields.creator.displayName,
          fields.priority.name,
          fields.duedate,
          fields.comment.comments,
          fields.issuelinks,
        ),
      );
    }
    return result;
  }
}

const adapter = new JiraAPIAdapter();
async function tempFunction() {
  console.log(await adapter.fetchIssues("1", "1"));
}
tempFunction();
