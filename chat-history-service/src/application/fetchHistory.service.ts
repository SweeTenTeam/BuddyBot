import { Injectable, Inject } from "@nestjs/common";
import { FetchHistoryUseCase, FH_USE_CASE } from "./port/in/fetchHistory-usecase.port";
import { FetchHistoryPort, FH_PORT_OUT } from "./port/out/fetchHistory.port";
import { FetchHistoryAdapter } from "src/adapter/out/fetchHistory.adapter";
import { Chat } from "src/domain/chat";
import { FetchHistoryCmd } from "src/domain/fetchHistoryCmd";


@Injectable()
export class FecthHistoryService implements FetchHistoryUseCase{
    constructor(@Inject(FH_PORT_OUT) private readonly FetchHistoryAdapter: FetchHistoryPort) {}

    async fetchStoricoChat(req: FetchHistoryCmd): Promise<Chat[]> {
        //return this.FetchHistoryPort.fetchStoricoChat(req);

        return Promise.resolve([ //mocckino, testo TODO
            new Chat("firstID", "Di che colore è l'Arancia?", "Blu", new Date())
        ]);
    }
}