import { Chat } from "src/domain/chat";
import { InsertChatCmd } from "src/domain/insertChatCmd";

export const IC_PORT_OUT = Symbol("IC_PORT_OUT")

export interface InsertChatPort {
    insertChat(cmd: InsertChatCmd): Promise<Chat>;
}