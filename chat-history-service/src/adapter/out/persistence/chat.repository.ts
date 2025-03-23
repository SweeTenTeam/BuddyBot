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

  async insertChat(question: string, answer: string, date: Date): Promise<boolean> {
    try {
      const newChat = this.chatRepo.create({ question, questionDate: date, answer });
      await this.chatRepo.save(newChat);
      console.log("Vamos")
      return true;
    } catch (error) {
      console.error('Error inserting chat:', error);
      return false;
    }
  }

  async fetchStoricoChat(lastChatId: string, numChat?: number): Promise<ChatEntity[]> {
    try {
      const take = numChat ? numChat : 5;
      return await this.chatRepo.find({
        where: { id: lastChatId },
        take,
        order: { answerDate: 'DESC' },
      });
    } catch(error) {
      throw new Error('Error during History-fetch')
    }
  }

}