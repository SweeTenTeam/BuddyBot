import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { fetchHistoryController } from './adapter/in/fetchHistory.controller';
import { FH_USE_CASE } from './application/port/in/fetchHistory-usecase.port';
import { fecthHistoryService } from './application/fetchHistory.service';
import { FH_PORT_OUT } from './application/port/out/fetchHistory.port';
import { FetchHistoryAdapter } from './adapter/out/fetchHistory.adapter';

@Module({
  imports: [],
  controllers: [fetchHistoryController],
  providers: [
    {
      provide: FH_USE_CASE,
      useClass: fecthHistoryService,
    },
    {
      provide: FH_PORT_OUT,
      useClass: FetchHistoryAdapter,
    }
  ],
})
export class AppModule {}
