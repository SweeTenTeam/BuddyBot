import { Ticket } from '../../../domain/Ticket.js';

export interface StoreJiraInfoPort {
  storeTickets(req: Ticket[]): boolean;
}
