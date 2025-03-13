import { Information } from "../../../domain/information.js"
import { RetrieveCmd } from "../../../domain/retreive-cmd.js"

export const RETRIEVAL_USE_CASE = Symbol('RETRIEVAL_USE_CASE');




export interface RetrievalUseCase{
    retrieveRelevantInfo(req: RetrieveCmd):Promise<Information[]>
}