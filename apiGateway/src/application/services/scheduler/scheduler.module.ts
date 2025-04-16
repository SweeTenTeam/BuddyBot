import { Module } from '@nestjs/common';
import { TasksService } from './scheduler.service';
import { StoricoMessageAdapter } from '../../../adapters/out/storico-message.adapter';
import { HistoryService } from '../../../infrastructure/rabbitmq/history.service';
import { InformationService } from '../../../infrastructure/rabbitmq/information.service';
import { InformationAdapter } from '../../../adapters/out/information.adapter';

@Module({
  imports: [],
  providers: [TasksService,
      { provide: 'StoricoPort', useClass: StoricoMessageAdapter },
      { provide: 'InfoPort', useClass: InformationAdapter },
      HistoryService,
      InformationService
    ],
})
export class TasksModule {}