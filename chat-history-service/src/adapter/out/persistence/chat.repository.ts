import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, DataSource } from 'typeorm';
import { ChatEntity } from './chat-entity';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepo: Repository<ChatEntity>,
  ) { }

  //inserimento di nuove conversazioni all'interno del db
  async insertChat(question: string, answer: string, date: Date): Promise<boolean> {
    try {
      const newChat = this.chatRepo.create({ question, answer, date });
      await this.chatRepo.save(newChat);
      console.log("Vamos")
      return true;
    } catch (error) {
      console.error('Error inserting chat:', error);
      return false;
    }
  }

  //recupero di conversazioni passate già inserite e presenti nel db
  async fetchStoricoChat(lastChatId: string, numChat?: number): Promise<ChatEntity[]> {
    const take = numChat ? numChat : 5;
    return await this.chatRepo.find({
      where: { id: lastChatId },
      take,
      order: { date: 'DESC' },
    });
  }

}