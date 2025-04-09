import { Injectable } from "@nestjs/common";
import { InsertLastUpdatePort } from "src/application/port/out/insertLastUpdate.port";
import { ChatRepository } from "./persistence/chat.repository";
import { LastUpdateCmd } from "src/domain/lastUpdateCmd";

@Injectable()
export class InsertLastUpdateAdapter implements InsertLastUpdatePort{
    constructor(private readonly insertNewerUpdate: ChatRepository){}

    async insertLastRetrieval(data: LastUpdateCmd): Promise<boolean> {
        return await this.insertNewerUpdate.insertLastRetrieval(data.LastFetch)
    }
}