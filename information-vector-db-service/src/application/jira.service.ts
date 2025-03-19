import { JiraCmd } from '../domain/command/JiraCmd.js';
import { JiraUseCase } from './port/in/JiraUseCase.js';
import { Injectable } from '@nestjs/common';
import { JiraAPIPort } from './port/out/JiraAPIPort.js';

@Injectable()
export class JiraService implements JiraUseCase {
  private readonly jiraAPIAdapter: JiraAPIPort;
  constructor(jiraAPIAdapter: JiraAPIPort) {
    this.jiraAPIAdapter = jiraAPIAdapter;
  }

  async fetchAndStoreJiraInfo(req: JiraCmd): Promise<boolean> {
    const tickets = await this.jiraAPIAdapter.fetchTickets(req);
    console.log(tickets[0]);
    //store logic
    return true;
  }
}
