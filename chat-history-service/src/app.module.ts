import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FetchHistoryController } from './adapter/in/fetchHistory.controller';
import { FH_USE_CASE } from './application/port/in/fetchHistory-usecase.port';
import { FecthHistoryService } from './application/fetchHistory.service';
import { FH_PORT_OUT } from './application/port/out/fetchHistory.port';
import { FetchHistoryAdapter } from './adapter/out/fetchHistory.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './adapter/out/persistence/chat-entity';
import { ChatRepository } from './adapter/out/persistence/chat.repository';
import { ChatModule } from './adapter/out/persistence/chat.module';
import { IC_USE_CASE } from './application/port/in/insertChat-usecase.port'
import { InsertChatService } from './application/insertChat.service';
import { IC_PORT_OUT } from './application/port/out/insertChat.port';
import { InsertChatAdapter } from './adapter/out/insertChat.adapter';
import { insertChatController } from './adapter/in/event/insertChat.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5433,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [ChatEntity],
      synchronize: true,
    }),
    ChatModule,
  ],
  controllers: [FetchHistoryController, insertChatController],
  providers: [
    {
      provide: FH_USE_CASE,
      useClass: FecthHistoryService,
    },
    {
      provide: FH_PORT_OUT,
      useClass: FetchHistoryAdapter,
    },
    {
      provide: IC_USE_CASE,
      useClass: InsertChatService
    },
    {
      provide: IC_PORT_OUT,
      useClass: InsertChatAdapter
    },
    ChatRepository
  ],
})
export class AppModule { }
