import { Injectable } from "@nestjs/common";
import { FetchHistoryPort } from "src/application/port/out/fetchHistory.port";
import { Chat } from "src/domain/chat";
import { FetchHistoryCmd } from "src/domain/fetchHistoryCmd";
import { ChatRepository } from "./persistence/chat.repository";
import { Message } from "src/domain/message";


@Injectable()
export class FetchHistoryAdapter implements FetchHistoryPort{
    constructor(private readonly fetchRepository: ChatRepository){}

    async fetchStoricoChat(req: FetchHistoryCmd): Promise<Chat[]> {
        const chats = await this.fetchRepository.fetchStoricoChat(req.id, req.numChat);
        const result: Chat[] = [];
        for(const chat of chats){
            result.push(new Chat(chat.id,new Message(chat.question,chat.questionDate.toISOString()),new Message(chat.answer,chat.answerDate.toISOString()),chat.lastFetch))
        }
        return result;
    }
}