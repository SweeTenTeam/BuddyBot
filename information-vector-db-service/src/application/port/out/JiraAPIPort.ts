import { Ticket } from '../../../domain/business/Ticket.js';
import { JiraCmd } from '../../../domain/command/JiraCmd.js';

export abstract class JiraAPIPort {
  abstract fetchTickets(req: JiraCmd): Promise<Ticket[]>;
}
