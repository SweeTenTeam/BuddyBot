import { Ticket } from 'src/domain/Ticket';
import { JiraCmd } from '../../../domain/JiraCmd';

export abstract class JiraAPIPort {
  abstract fetchTickets(req: JiraCmd): Promise<Ticket[]>;
}
