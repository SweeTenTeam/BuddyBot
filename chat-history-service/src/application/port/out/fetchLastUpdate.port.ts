import { LastUpdate } from "src/domain/lastUpdate"

export const FU_PORT_OUT = Symbol("FU_PORT_OUT")

export interface FetchLastUpdatePort{
    fetchLastUpdate(): Promise<LastUpdate>
}