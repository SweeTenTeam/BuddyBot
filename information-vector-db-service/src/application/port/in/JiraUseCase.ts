import { JiraCmd } from "../../../domain/JiraCmd";
import { Ticket } from "../../../domain/Ticket";

export interface JiraUseCase {
  fetchTickets(req: JiraCmd): Ticket[];
}
