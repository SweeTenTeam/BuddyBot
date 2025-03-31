import { Module } from '@nestjs/common';
import { InformationService } from './information.service';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { InformationController } from './information.controller';

@Module({
  imports: [],
  controllers: [InformationController, HistoryController],
  providers: [InformationService,HistoryService],
})
export class AppModule {}
