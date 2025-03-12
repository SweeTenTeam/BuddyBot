import { Ticket } from '../../../domain/Ticket';

export interface StoreJiraInfoPort {
  storeTickets(req: Ticket[]): boolean;
}
