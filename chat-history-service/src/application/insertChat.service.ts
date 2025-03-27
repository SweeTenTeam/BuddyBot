import { Inject, Injectable } from "@nestjs/common";
import { InsertChatUseCase } from "./port/in/insertChat-usecase.port";
import { InsertChatCmd } from "src/domain/insertChatCmd";
import { IC_PORT_OUT, InsertChatPort } from "./port/out/insertChat.port";

@Injectable()
export class InsertChatService implements InsertChatUseCase {
    constructor(@Inject(IC_PORT_OUT) private readonly InsertChatAdapter: InsertChatPort) { }

    async insertChat(req: InsertChatCmd): Promise<boolean> {
        return this.InsertChatAdapter.insertChat(req);
    }
}