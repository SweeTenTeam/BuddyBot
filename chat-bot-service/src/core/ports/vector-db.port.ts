import { Information } from '../../domain/entities/information.entity.js';
import { ReqAnswerCmd } from '../../application/commands/request-answer.cmd.js';


export const VECTOR_DB_PORT = 'VECTOR_DB_PORT'; // Token simbolico


export interface VectorDbPort {
  searchVectorDb(req: ReqAnswerCmd): Promise<Information[]>;
}