import { Chat } from "../../../domain/chat"
import { FetchHistoryCmd } from "../../../domain/fetchHistoryCmd"

export const FH_PORT_OUT = Symbol("FH_PORT_OUT")

export interface FetchHistoryPort{
    fetchStoricoChat(req: FetchHistoryCmd): Promise<Chat[]>
}