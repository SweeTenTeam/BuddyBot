import { LastUpdateCmd } from "src/domain/lastUpdateCmd"

export const IU_PORT_OUT = Symbol("IU_PORT_OUT")

export interface InsertLastUpdatePort{
    insertLastRetrieval(data: LastUpdateCmd): Promise<boolean>
}