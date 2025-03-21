import { Ticket } from '../../../domain/business/Ticket.js';

export interface JiraStoreInfoPort {
  storeTickets(req: Ticket[]): Promise<boolean>;
}
