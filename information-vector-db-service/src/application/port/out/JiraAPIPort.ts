import { Ticket } from '../../../domain/Ticket.js';
import { JiraCmd } from '../../../domain/JiraCmd.js';

export abstract class JiraAPIPort {
  abstract fetchTickets(req: JiraCmd): Promise<Ticket[]>;
}
