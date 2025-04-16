import { Injectable, Inject } from "@nestjs/common";
import { FetchHistoryUseCase, FH_USE_CASE } from "./port/in/fetchHistory-usecase.port";
import { FetchHistoryPort, FH_PORT_OUT } from "./port/out/fetchHistory.port";
import { Chat } from "src/domain/chat";
import { FetchHistoryCmd } from "src/domain/fetchHistoryCmd";


@Injectable()
export class FetchHistoryService implements FetchHistoryUseCase{
    constructor(@Inject(FH_PORT_OUT) private readonly FetchHistoryAdapter: FetchHistoryPort) {}

    async fetchStoricoChat(req: FetchHistoryCmd): Promise<Chat[]> {
        return this.FetchHistoryAdapter.fetchStoricoChat(req);
    }
}