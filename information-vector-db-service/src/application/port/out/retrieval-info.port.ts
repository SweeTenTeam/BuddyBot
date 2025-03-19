import { Information } from "../../../domain/business/information.js";
import { RetrieveCmd } from "../../../domain/command/retreive-cmd.js";

export const RETRIEVAL_PORT = Symbol("RETRIVAL_PORT");

export interface RetrievalPort {
  retrieveRelevantInfo(req: RetrieveCmd): Promise<Information[]>;
}