import { Injectable } from '@nestjs/common';
import { InfoPort } from '../../application/ports/out/information.port';
import { InformationService } from '../../infrastructure/rabbitmq/information.service';
import { FetchConfluenceCMD } from '../../domain/cmds/FetchConfluenceCMD';
import { FetchJiraCMD } from '../../domain/cmds/FetchJiraCMD';
import { FetchGithubCMD } from '../../domain/cmds/FetchGithubCMD';



@Injectable()
export class InformationAdapter implements InfoPort {
  constructor(private readonly informationService: InformationService) {}
  
  async fetchUpdateGithub(req: FetchGithubCMD): Promise<Boolean> {
    console.log(`Mandata Richiesta di Fetch github`);

    const resultGithub = await this.informationService.sendMessage('fetchAndStoreGithub', req);
    
    console.log(`Fetch delle info github completato?:`, resultGithub);
    return resultGithub;
  }

  async fetchUpdateJira(req: FetchJiraCMD): Promise<Boolean> {
    console.log(`Mandata Richiesta di Fetch jira`);

    const resultJira = await this.informationService.sendMessage('fetchAndStoreJira', req);

    console.log(`Fetch delle info jira completato?:`, resultJira);
    return resultJira;
  }

  async fetchUpdateConf(req: FetchConfluenceCMD): Promise<Boolean> {
    console.log(`Mandata Richiesta di Fetch confluence`);

    const resultConf = await this.informationService.sendMessage('fetchAndStoreConfluence', req);
    
    console.log(`Fetch delle info confluence completato?:`, resultConf);
    return resultConf;
  }

}

