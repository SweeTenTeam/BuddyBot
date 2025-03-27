import { Injectable } from "@nestjs/common";
import { FetchHistoryPort } from "src/application/port/out/fetchHistory.port";
import { Chat } from "src/domain/chat";
import { FetchHistoryCmd } from "src/domain/fetchHistoryCmd";
import { ChatRepository } from "./persistence/chat.repository";


@Injectable()
export class FetchHistoryAdapter implements FetchHistoryPort{
    constructor(private readonly fetchRepository: ChatRepository){}

    async fetchStoricoChat(req: FetchHistoryCmd): Promise<Chat[]> {
        return this.fetchRepository.fetchStoricoChat(req.id, req.numChat);
    }
}