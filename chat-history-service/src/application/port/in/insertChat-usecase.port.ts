import { Chat } from "src/domain/chat"
import { InsertChatCmd } from "../../../domain/insertChatCmd"

export const IC_USE_CASE = Symbol("IC_USE_CASE")

export interface InsertChatUseCase {
    insertChat(req: InsertChatCmd): Promise<Chat>
}