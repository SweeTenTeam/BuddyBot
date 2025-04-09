import { LastUpdate } from "src/domain/lastUpdate"

export const FU_USE_CASE = Symbol("FU_USE_CASE")

export interface FetchLastUpdateUseCase{
    fetchLastUpdate(): Promise<LastUpdate>
}