import { Chat } from "../../../domain/chat"
import { FetchHistoryCmd} from "../../../domain/fetchHistoryCmd"

export const FH_USE_CASE = Symbol("FH_USE_CASE")

export interface FetchHistoryUseCase{
    fetchStoricoChat(req: FetchHistoryCmd): Promise<Chat[]>
}