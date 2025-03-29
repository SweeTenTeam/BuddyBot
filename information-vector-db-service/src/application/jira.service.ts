import { JiraCmd } from '../domain/command/JiraCmd.js';
import { JiraUseCase } from './port/in/JiraUseCase.js';
import { Injectable } from '@nestjs/common';
import { JiraAPIPort } from './port/out/JiraAPIPort.js';
import { JiraStoreAdapter } from 'src/adapter/out/JiraStoreAdapter.js';

@Injectable()
export class JiraService implements JiraUseCase {
  private readonly jiraAPIAdapter: JiraAPIPort;
  private readonly jiraStoreAdapter: JiraStoreAdapter;
  constructor(
    jiraAPIAdapter: JiraAPIPort,
    jiraStoreAdapter: JiraStoreAdapter
  ) {
    this.jiraAPIAdapter = jiraAPIAdapter;
    this.jiraStoreAdapter = jiraStoreAdapter;
  }

  async fetchAndStoreJiraInfo(req: JiraCmd): Promise<boolean> {
    const tickets = await this.jiraAPIAdapter.fetchTickets(req);
    console.log(tickets[0]);
    //store logic
    await this.jiraStoreAdapter.storeTickets(tickets);
    return true;
  }
}
