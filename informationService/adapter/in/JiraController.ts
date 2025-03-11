import { JiraService } from "../../application/JiraService";
import { JiraCmd } from "../../domain/JiraCmd";
import { Ticket } from "../../domain/Ticket";

export class JiraController{
    async fetchJiraInfo(req: JSON): Promise<Ticket[]> {
        const jiraService = new JiraService();
        return await jiraService.fetchIssues(new JiraCmd(req));
    }
}