import { Injectable } from '@nestjs/common';
import { VectorDbPort } from '../../../core/ports/vector-db.port.js';
import { ClientProxy } from '@nestjs/microservices';
import { ReqAnswerCmd } from '../../../application/commands/request-answer.cmd.js';
import { Information } from '../../../domain/entities/information.entity.js';
import { Metadata } from '../../../domain/entities/metadata.entity.js';
import { VectorDbClient } from '../../../vectordb.client.js';

@Injectable()
export class VectorDbAdapter implements VectorDbPort {
    constructor(private client: VectorDbClient) { }
    async searchVectorDb(req: ReqAnswerCmd): Promise<Information[]> {
        let result: Information[] = [];
        const res = await this.client.sendMessage("retrieve.information", { query: req.getText() }) //maybe retrieve-information?
        //console.log(res);
        for (const r of JSON.parse(JSON.stringify(res))) {
            let i = new Information(r.content, new Metadata(r.metadata.origin, r.metadata.type, r.metadata.originID))
            result.push(i);
        }
        console.log("Documents received from chatbot: ");
        console.log(result);
        return result;



        //[{content:"dlkjashdflkjahsdfkl", metatada: {origin:klfjhs, type:djdj, originID:jdjd},
        // {content:"dlkjashdflkjahsdfkl", metatada: {origin:klfjhs, type:djdj, originID:jdjd},
        // {content:"dlkjashdflkjahsdfkl", metatada: {origin:klfjhs, type:djdj, originID:jdjd}]
    }
}