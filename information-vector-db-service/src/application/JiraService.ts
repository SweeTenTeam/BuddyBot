import { JiraAPIAdapter } from "../adapter/out/JiraAPIAdapter";
import { JiraCmd } from "../domain/JiraCmd";
import { Ticket } from "../domain/Ticket";
import { JiraUseCase } from "./port/in/JiraUseCase";
import { Inject, Injectable } from '@nestjs/common';
import { JiraAPIPort } from "./port/out/JiraAPIPort";

@Injectable()
export class JiraService implements JiraUseCase {
  private readonly jiraAPIAdapter: JiraAPIPort;
  constructor(jiraAPIAdapter: JiraAPIPort) {
    this.jiraAPIAdapter = jiraAPIAdapter;
  }

  async fetchAndStoreJiraInfo(req: JiraCmd): Promise<boolean> {
    let tickets = await this.jiraAPIAdapter.fetchTickets(req);
    //store logic
    return true;
  }
}
