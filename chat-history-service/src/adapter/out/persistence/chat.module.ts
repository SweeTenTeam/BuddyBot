import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './chat-entity';
import { ChatConsumer } from 'src/adapter/in/event/chat.consumer';
import { RabbitMQService } from 'src/adapter/in/event/rabbitmq.service';
import { insertChatController } from 'src/adapter/in/event/insertChat.controller';
import { InsertChatService } from 'src/application/insertChat.service';
import { IC_USE_CASE } from 'src/application/port/in/insertChat-usecase.port';
import { IC_PORT_OUT } from 'src/application/port/out/insertChat.port';
import { InsertChatAdapter } from '../insertChat.adapter';
import { ChatRepository } from './chat.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity]),
  ],
  exports: [TypeOrmModule, RabbitMQService],
  providers: [RabbitMQService,
    {
      provide: IC_USE_CASE,
      useClass: InsertChatService
    },
    {
      provide: IC_PORT_OUT,
      useClass: InsertChatAdapter
    }, ChatRepository
  ],
  controllers: [ChatConsumer, insertChatController]
})
export class ChatModule { }
