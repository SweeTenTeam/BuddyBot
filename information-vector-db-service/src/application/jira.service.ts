import { JiraCmd } from '../domain/JiraCmd';
import { JiraUseCase } from './port/in/JiraUseCase';
import { Injectable } from '@nestjs/common';
import { JiraAPIPort } from './port/out/JiraAPIPort';

@Injectable()
export class JiraService implements JiraUseCase {
  private readonly jiraAPIAdapter: JiraAPIPort;
  constructor(jiraAPIAdapter: JiraAPIPort) {
    this.jiraAPIAdapter = jiraAPIAdapter;
  }

  async fetchAndStoreJiraInfo(req: JiraCmd): Promise<boolean> {
    const tickets = await this.jiraAPIAdapter.fetchTickets(req);
    console.log(tickets);
    //store logic
    return true;
  }
}
