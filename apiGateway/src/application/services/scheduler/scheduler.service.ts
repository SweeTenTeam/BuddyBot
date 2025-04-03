import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron , Interval} from '@nestjs/schedule';

import { StoricoPort } from '../../ports/out/storico.port';
import { InfoPort } from '../../ports/out/information.port';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @Inject('InfoPort') private readonly infoPort: InfoPort,
    @Inject('StoricoPort') private readonly storicoPort: StoricoPort,
  ) {}
/*
  @Interval(10000)
  handleInterval() {
    this.logger.debug('Called every 10 seconds');
  }*/

  @Cron('0 */5 * * * *')
  async handleCron() {
    const DataFetch = Date.now().toString();

    this.logger.debug(`Every 5 minuti: ${DataFetch}`);

    const resultFetch = await this.infoPort.fetchUpdate(DataFetch);
//
    if (resultFetch){
      console.log(`Fetch informazioni in information service successo:`, resultFetch);

      const result = await this.storicoPort.postUpdate(DataFetch)

      console.log(`Data fetch salvata?:`, result);
    }else{
      console.log(`Fetch informazioni in information service fallito:`, resultFetch);
    }
  }

}
