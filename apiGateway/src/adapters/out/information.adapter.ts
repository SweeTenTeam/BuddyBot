import { Injectable } from '@nestjs/common';
import { InfoPort } from '../../application/ports/out/information.port';
import { InformationService } from '../../infrastructure/rabbitmq/information.service';



@Injectable()
export class InformationAdapter implements InfoPort {
  constructor(private readonly informationService: InformationService) {}

  /* DA METTERE I DTO RICHIESTI DA INFO CONTROLLE IN MIC SERV INFO*/
  
  async fetchUpdate(req: any): Promise<Boolean> {
    console.log(`Mandata Richiesta di Fetch`);

    const resultGithub = await this.informationService.sendMessage('fetchAndStoreGithub', req);
    const resultJira = await this.informationService.sendMessage('fetchAndStoreJira', req);
    const resultConf = await this.informationService.sendMessage('fetchAndStoreConfluence', req);

    const result = (resultGithub && resultJira && resultConf);
    
    console.log(`Fetch delle info completato?:`, result);
    return result;
  }
}

