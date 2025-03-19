import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './chat-entity';
import { ChatRepository } from './chat.repository';
import { ChatConsumer } from 'src/adapter/in/event/chat.consumer';
import { ChatController } from 'src/adapter/in/event/chat.controller';
import { RabbitMQService } from 'src/adapter/in/event/rabbitmq.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity]),
  ],
  exports: [TypeOrmModule],
  providers: [RabbitMQService],
  controllers: [ChatConsumer, ChatController]
})
export class ChatModule { }
