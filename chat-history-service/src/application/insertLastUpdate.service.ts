import { Inject, Injectable } from "@nestjs/common";
import { InsertLastUpdateUseCase, IU_USE_CASE } from "./port/in/insertLastUpdate-usecase.port";
import { InsertLastUpdatePort } from "./port/out/insertLastUpdate.port";
import { LastUpdateCmd } from "src/domain/lastUpdateCmd";

@Injectable()
export class InsertLastUpdateService implements InsertLastUpdateUseCase{
    constructor(@Inject(IU_USE_CASE) private readonly InsertLastUpdateAdapter: InsertLastUpdatePort) {}

    async insertLastRetrieval(data: LastUpdateCmd): Promise<boolean> {
        return this.InsertLastUpdateAdapter.insertLastRetrieval(data);
    }
}