import { Inject, Injectable } from "@nestjs/common";
import { InsertChatUseCase } from "./port/in/insertChat-usecase.port";
import { InsertChatCmd } from "src/domain/insertChatCmd";
import { IC_PORT_OUT, InsertChatPort } from "./port/out/insertChat.port";
import { Chat } from "src/domain/chat";

@Injectable()
export class InsertChatService implements InsertChatUseCase {
    constructor(@Inject(IC_PORT_OUT) private readonly InsertChatAdapter: InsertChatPort) { }

    async insertChat(req: InsertChatCmd): Promise<Chat> {
        return this.InsertChatAdapter.insertChat(req);
    }
}