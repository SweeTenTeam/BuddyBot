import { Inject, Injectable } from '@nestjs/common';
import { JiraAPIPort, JIRA_API_PORT } from './port/out/JiraAPIPort.js';
import { JiraStoreInfoPort, JIRA_STORE_INFO_PORT } from './port/out/JiraStoreInfoPort.js';
import { JiraCmd } from '../domain/command/JiraCmd.js';
import { Ticket } from '../domain/business/Ticket.js';

@Injectable()
export class JiraService {
  constructor(
    @Inject(JIRA_API_PORT) private readonly jiraApi: JiraAPIPort,
    @Inject(JIRA_STORE_INFO_PORT) private readonly jiraStore: JiraStoreInfoPort
  ) {}

  async fetchAndStoreJiraInfo(req: JiraCmd): Promise<boolean> {
    const tickets = await this.jiraApi.fetchTickets(req);
    return this.jiraStore.storeTickets(tickets);
  }
}
