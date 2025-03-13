import { Information } from "src/domain/information";
import { RetrieveCmd } from "src/domain/retreive-cmd";

export const RETRIEVAL_PORT = Symbol("RETRIVAL_PORT");


export interface RetrievalPort {
  retrieveRelevantInfo(req: RetrieveCmd): Information[];
}