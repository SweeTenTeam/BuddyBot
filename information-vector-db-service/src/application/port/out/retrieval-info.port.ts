import { Information } from "../../../domain/information.js";
import { RetrieveCmd } from "../../../domain/retreive-cmd.js";

export const RETRIEVAL_PORT = Symbol("RETRIVAL_PORT");


export interface RetrievalPort {
  retrieveRelevantInfo(req: RetrieveCmd): Information[];
}