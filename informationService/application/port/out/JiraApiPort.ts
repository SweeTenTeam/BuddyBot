import { JiraCmd } from "../../../domain/JiraCmd";
import { Ticket } from "../../../domain/Ticket";

export interface JiraAPIPort {
  fetchTicket(req: JiraCmd): Ticket[];
}
