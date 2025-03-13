import { JiraCmd } from '../domain/JiraCmd.js';
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
    //store logic
    return true;
  }
}
