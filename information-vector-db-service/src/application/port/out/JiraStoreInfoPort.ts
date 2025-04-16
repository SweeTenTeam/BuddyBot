import { Ticket } from '../../../domain/business/Ticket.js';
import { Result } from '../../../domain/business/Result.js';

export const JIRA_STORE_INFO_PORT = Symbol('JIRA_STORE_INFO_PORT');

export interface JiraStoreInfoPort {
  storeTickets(req: Ticket[]): Promise<Result>;
} 