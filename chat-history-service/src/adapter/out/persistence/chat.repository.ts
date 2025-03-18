import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, DataSource } from 'typeorm';
import { ChatEntity } from './chat-entity';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepo: Repository<ChatEntity>,
) {}

async fetchStoricoChat(lastChatId: string, numChat?: number): Promise<ChatEntity[]> {
  const take = numChat ? numChat : 5;
  return await this.chatRepo.find({
    where: { id: lastChatId },
    take,
    order: { date: 'DESC' },
  });
}
}