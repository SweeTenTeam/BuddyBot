import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './chat-entity';
import { ChatRepository } from './chat.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity]),
  ],
  exports: [TypeOrmModule],
})
export class ChatModule {}
