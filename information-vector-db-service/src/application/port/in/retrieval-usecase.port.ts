import { Information } from "src/domain/information"
import { RetrieveCmd } from "src/domain/retreive-cmd"

export const RETRIEVAL_USE_CASE = Symbol('RETRIEVAL_USE_CASE');




export interface RetrievalUseCase{
    retrieveRelevantInfo(req: RetrieveCmd):Promise<Information[]>
}