import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StoricoPort } from '../../ports/out/storico.port';
import { InfoPort } from '../../ports/out/information.port';
import { FetchConfluenceCMD } from '../../../domain/cmds/FetchConfluenceCMD';
import { FetchJiraCMD } from '../../../domain/cmds/FetchJiraCMD';
import { FetchGithubCMD } from '../../../domain/cmds/FetchGithubCMD';
import { RepoGithubCMD } from '../../../domain/cmds/RepoGithubCMD';
import { LastUpdateCMD } from '../../../domain/cmds/LastUpdateCMD';

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @Inject('InfoPort') private readonly infoPort: InfoPort,
    @Inject('StoricoPort') private readonly storicoPort: StoricoPort,
  ) { }


  async onModuleInit() {
    /** COMMENT AFTER FIRST BUILD / UN-CONMMENT FOR FIRST BUILD */
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    await sleep(10000); //ASPETTA CHE tutti i servizi siano attivi RABBIT PARTA

    this.logger.debug('Esecuzione FETCH iniziale...');
    await this.runFetch();
  }


  /** SCHEDULER OGNI TOT >< */
  @Cron('0 */60 * * * *')
  async handleCron() {
    this.logger.debug('Esecuzione FETCH ogni TOT (ogni 5 min)...');
    await this.runFetch();
  }



  private async runFetch() {
    try {
      this.logger.debug('Richiesta della data di ultimo FETCH (SERVICE)');
      const isoDateString = await this.storicoPort.getLastUpdate();

      let DataFetch: Date;
      //let GitDataFetch: Date;

      if (!isoDateString?.LastFetch) {

        DataFetch = new Date();
        DataFetch.setMonth(DataFetch.getMonth() - 9); //RECUPERO INFO DA NOVE MESI FA AD ADESSO

        //const GitDataFetch = new Date();
        //GitDataFetch.setDate(GitDataFetch.getDate() - 7); /** GITHUB - 7 giorni*/

        this.logger.warn(`Nessuna data FETCH (SERVICE) precedente. Uso data di fallback: ${DataFetch}`);
      } else {
        /** PROVA POI VA MESSA DATA DA FETCH PER LA PRIMA VOLTA */
        //DataFetch = new Date();
        //DataFetch.setMonth(DataFetch.getMonth() - 7);
        DataFetch = new Date(isoDateString.LastFetch);
        this.logger.debug(`FETCH (SERVICE) da data salvata trovata: ${DataFetch}`);
      }

      // DATI HARDCODED
      const boardId = 1;
      const jiraCmd = new FetchJiraCMD(boardId, DataFetch);
      const confCmd = new FetchConfluenceCMD(DataFetch);

      const owner = process.env.GITHUB_OWNER || 'SweeTenTeam';
      const repoName = process.env.GITHUB_REPO || 'Demo';
      const branch = process.env.GITHUB_BRANCH || 'main';
      const repoCMD = new RepoGithubCMD(owner, repoName, branch);
      const githubCmd = new FetchGithubCMD([repoCMD], DataFetch);

      const resultFetchJira = await this.infoPort.fetchUpdateJira(jiraCmd);
      const resultFetchConf = await this.infoPort.fetchUpdateConf(confCmd);
      const resultFetchGithub = await this.infoPort.fetchUpdateGithub(githubCmd);

      if (resultFetchJira && resultFetchGithub && resultFetchConf) {
        this.logger.log(`FETCH (SERVICE) completato con successo.`);

        /**NEW LAST FETCH DATE */
        const NewDataFetch = new Date();
        const lastUpdateCmd = new LastUpdateCMD(NewDataFetch.toISOString());
        const result = await this.storicoPort.postUpdate(lastUpdateCmd);

        this.logger.debug(`Salvataggio data fetch riuscito: ${result}`);
      } else {
        this.logger.error(`FETCH (SERVICE) fallito: almeno uno dei servizi ha dato errore.`);
      }
    } catch (error) {
      this.logger.error('Errore nel FETCH (SERVICE) iniziale', error);
    }
  }

}