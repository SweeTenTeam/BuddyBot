import { Inject, Injectable } from "@nestjs/common";
import { FetchLastUpdateUseCase } from "./port/in/fetchLastUpdate-usecase";
import { LastUpdate } from "src/domain/lastUpdate";
import { FetchLastUpdatePort, FU_PORT_OUT } from "./port/out/fetchLastUpdate.port";

@Injectable()
export class FetchLastUpdateService implements FetchLastUpdateUseCase{
    constructor(@Inject(FU_PORT_OUT) private readonly fetchLastUpdateAdapter: FetchLastUpdatePort) {}

    async fetchLastUpdate(): Promise<LastUpdate> {
        return this.fetchLastUpdateAdapter.fetchLastUpdate();
    }
}