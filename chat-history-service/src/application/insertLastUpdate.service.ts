import { Inject, Injectable } from "@nestjs/common";
import { InsertLastUpdateUseCase } from "./port/in/insertLastUpdate-usecase.port";
import { InsertLastUpdatePort, IU_PORT_OUT } from "./port/out/insertLastUpdate.port";
import { LastUpdateCmd } from "src/domain/lastUpdateCmd";

@Injectable()
export class InsertLastUpdateService implements InsertLastUpdateUseCase{
    constructor(@Inject(IU_PORT_OUT) private readonly InsertLastUpdateAdapter: InsertLastUpdatePort) {}

    async insertLastRetrieval(data: LastUpdateCmd): Promise<boolean> {
        return this.InsertLastUpdateAdapter.insertLastRetrieval(data);
    }
}