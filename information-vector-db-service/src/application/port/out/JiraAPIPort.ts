import { Ticket } from 'src/domain/Ticket';
import { JiraCmd } from '../../../domain/JiraCmd';

export interface JiraAPIPort {
  fetchTickets(req: JiraCmd): Promise<Ticket[]>;
}
