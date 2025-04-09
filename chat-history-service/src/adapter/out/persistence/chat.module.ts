import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './chat-entity';
import { ChatConsumer } from 'src/adapter/in/event/chat.consumer';
import { InsertChatService } from 'src/application/insertChat.service';
import { IC_USE_CASE } from 'src/application/port/in/insertChat-usecase.port';
import { IC_PORT_OUT } from 'src/application/port/out/insertChat.port';
import { InsertChatAdapter } from '../insertChat.adapter';
import { ChatRepository } from './chat.repository';
import { LastUpdateEntity } from './lastFetch-entity';
import { IU_USE_CASE } from 'src/application/port/in/insertLastUpdate-usecase.port';
import { InsertLastUpdateService } from 'src/application/insertLastUpdate.service';
import { IU_PORT_OUT } from 'src/application/port/out/insertLastUpdate.port';
import { InsertLastUpdateAdapter } from '../insertLastUpdate.adapter';
import { InsertLastUpdateController } from 'src/adapter/in/insertLastUpdate.controller';
import { FU_PORT_OUT } from 'src/application/port/out/fetchLastUpdate.port';
import { fetchLastUpdateAdapter } from '../fetchLastUpdate.adapter';
import { FU_USE_CASE } from 'src/application/port/in/fetchLastUpdate-usecase';
import { FetchLastUpdateService } from 'src/application/fetchLastUpdate.service';
import { FetchLastUpdateController } from 'src/adapter/in/fetchLastUpdate.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity, LastUpdateEntity]),
  ],
  exports: [TypeOrmModule],
  providers: [
    {
      provide: IC_USE_CASE,
      useClass: InsertChatService
    },
    {
      provide: IC_PORT_OUT,
      useClass: InsertChatAdapter
    }, 
    {
      provide: IU_USE_CASE,
      useClass: InsertLastUpdateService
    }, 
    {
      provide: IU_PORT_OUT,
      useClass: InsertLastUpdateAdapter
    },
    {
      provide: FU_USE_CASE,
      useClass: FetchLastUpdateService
    },
    {
      provide: FU_PORT_OUT,
      useClass: fetchLastUpdateAdapter
    }, ChatRepository
  ],
  controllers: [ChatConsumer, InsertLastUpdateController, FetchLastUpdateController]
})
export class ChatModule { }








/*@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity]),
  ],
  exports: [TypeOrmModule],
  providers: [
    {
      provide: IC_USE_CASE,
      useClass: InsertChatService
    },
    {
      provide: IC_PORT_OUT,
      useClass: InsertChatAdapter
    }, ChatRepository
  ],
  controllers: [ChatConsumer]
})
export class ChatModule { }*/
