import { Injectable } from "@nestjs/common";
import { FetchLastUpdatePort } from "src/application/port/out/fetchLastUpdate.port";
import { ChatRepository } from "./persistence/chat.repository";
import { LastUpdate } from "src/domain/lastUpdate";

@Injectable()
export class fetchLastUpdateAdapter implements FetchLastUpdatePort{
    constructor(private readonly fetchLURepository: ChatRepository){}

    async fetchLastUpdate(): Promise<LastUpdate> {
        const date_entity = await this.fetchLURepository.fetchLastUpdate();
        const date = new LastUpdate(date_entity.lastFetch.toISOString());
        return date
    }
}