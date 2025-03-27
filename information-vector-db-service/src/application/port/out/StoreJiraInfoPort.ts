import { Ticket } from '../../../domain/business/Ticket.js';

export interface StoreJiraInfoPort {
  storeTickets(req: Ticket[]): boolean;
}
