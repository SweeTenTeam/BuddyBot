import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron , Interval} from '@nestjs/schedule';
import { StoricoPort } from '../../ports/out/storico.port';
import { InfoPort } from '../../ports/out/information.port';
import { FetchConfluenceCMD } from '../../../domain/cmds/FetchConfluenceCMD';
import { FetchJiraCMD } from '../../../domain/cmds/FetchJiraCMD';
import { FetchGithubCMD } from '../../../domain/cmds/FetchGithubCMD';
import { RepoGithubCMD } from '../../../domain/cmds/RepoGithubCMD'


@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @Inject('InfoPort') private readonly infoPort: InfoPort,
    @Inject('StoricoPort') private readonly storicoPort: StoricoPort,
  ) {}

  @Cron('0 */5 * * * *')/**UPDATE EVERY 5 MINUTI */
  async handleCron() {
    const DataFetch = new Date();
    this.logger.debug(`Every 5 minuti: ${DataFetch}`);

    /** DATI REPOs DA CONFIGURARE UN .ENV UNICO CON TUTTO !!! */
    /** {JIRA} */
    const boardId = 1;
    const jiraCmd = new FetchJiraCMD(boardId, DataFetch);
    /** {CONFLUENCE} */
    const confCmd = new FetchConfluenceCMD(DataFetch);
    /** {GITHUB} */
    const owner = process.env.GITHUB_OWNER || 'SweeTenTeam';
    const repoName = process.env.GITHUB_REPO || 'BuddyBot';
    const branch = 'develop';
    const repoCMD = new RepoGithubCMD(owner, repoName, branch);
    const githubCmd = new FetchGithubCMD([repoCMD], DataFetch);


    const resultFetchJira = await this.infoPort.fetchUpdateJira(jiraCmd);
    const resultFetchConf = await this.infoPort.fetchUpdateConf(confCmd);
    const resultFetchGithub = await this.infoPort.fetchUpdateGithub(githubCmd);

    /** ONLY IF ALL FETCHS ARE OK SAVE LAST FETCH*/
    if (resultFetchJira && resultFetchGithub && resultFetchConf){
      console.log(`Fetch informazioni in information service successo`);

      const result = await this.storicoPort.postUpdate(DataFetch.toString())

      console.log(`Data fetch salvata?:`, result);
    }else{
      console.log(`Fetch informazioni in information service fallito`);
    }
  }

}
