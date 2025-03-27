import { Injectable } from '@nestjs/common';
import { VectorDbPort } from 'src/core/ports/vector-db.port';
import { ClientProxy} from '@nestjs/microservices';
import { ReqAnswerCmd } from 'src/application/commands/request-answer.cmd';
import { Information } from 'src/domain/entities/information.entity';
import { query } from 'express';
import { Metadata } from 'src/domain/entities/metadata.entity';

@Injectable()
export class VectorDbAdapter implements VectorDbPort {
    constructor( private client: ClientProxy) {}
    async searchVectorDb(req: ReqAnswerCmd): Promise<Information[]>{
        let result : Information[]=[]
        const res = this.client.send("retrieve.information", {query:req.getText()})
        for(const r of JSON.parse(JSON.stringify(res))){
            let i = new Information(r.content, new Metadata(r.metadata.origin, r.metadata.type, r.metadata.originID))
            result.push(i);
        }
        return result;
    

     
        //[{content:"dlkjashdflkjahsdfkl", metatada: {origin:klfjhs, type:djdj, originID:jdjd},
        // {content:"dlkjashdflkjahsdfkl", metatada: {origin:klfjhs, type:djdj, originID:jdjd},
        // {content:"dlkjashdflkjahsdfkl", metatada: {origin:klfjhs, type:djdj, originID:jdjd}]
    }
}