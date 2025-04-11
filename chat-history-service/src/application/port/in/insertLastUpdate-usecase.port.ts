import { LastUpdateCmd } from "src/domain/lastUpdateCmd"

export const IU_USE_CASE = Symbol("IU_USE_CASE")

export interface InsertLastUpdateUseCase{
    insertLastRetrieval(data: LastUpdateCmd): Promise<boolean>
}