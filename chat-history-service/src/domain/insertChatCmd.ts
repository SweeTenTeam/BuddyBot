import { Message } from "./message";

export class InsertChatCmd {
    question: Message
    answer: { content: string }
}