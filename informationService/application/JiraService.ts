import { JiraAPIAdapter } from "../adapter/out/JiraAPIAdapter";
import { JiraCmd } from "../domain/JiraCmd";
import { Ticket } from "../domain/Ticket";
import { JiraUseCase } from "./port/in/JiraUseCase";

class JiraService implements JiraUseCase {
  fetchTickets(req: JiraCmd): Ticket[] {
    let tickets = Ticket[3];
    return tickets;
  }
  async fetchIssues(req: JiraCmd): Promise<Ticket[]> {
    let jiraAPIAdapter = new JiraAPIAdapter();
    let tickets = jiraAPIAdapter.fetchIssues("1", "150");
    return tickets;
  }
}
