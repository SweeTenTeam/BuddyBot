import { Ticket } from '../../../domain/business/Ticket.js';
import { JiraCmd } from '../../../domain/command/JiraCmd.js';

export const JIRA_API_PORT = Symbol('JIRA_API_PORT');


export interface JiraAPIPort {
  fetchTickets(req: JiraCmd): Promise<Ticket[]>;
}
