import { JiraCmd } from "../../../domain/JiraCmd";
import { Ticket } from "../../../domain/Ticket";

export interface JiraAPIPort {
  fetchTickets(req: JiraCmd): Promise<Ticket[]>;
}
