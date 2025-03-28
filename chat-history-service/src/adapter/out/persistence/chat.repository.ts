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

  /*
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
  */

  async fetchStoricoChat(lastChatId: string, numChat?: number): Promise<ChatEntity[]> {
    try {
      const take = numChat ? numChat : 5;
      // Trova la chat corrente (quella dell'ID)
    const lastChat = await this.chatRepo.findOne({
      where: { id: lastChatId },
    });

    if (!lastChat) {
      throw new Error('Last chat ID not found');
    }

    // Recupera le (numChat - 1) chat precedenti
    const previousChats = await this.chatRepo.find({
      where: {
        answerDate: LessThan(lastChat.answerDate),
      },
      order: { answerDate: 'DESC' },
      take: take - 1,
    });

    // Combina: [lastChat, ...previousChats] mantenendo l’ordine corretto
    const combined = [lastChat, ...previousChats];

    // Se vuoi mostrarli dal più vecchio al più recente
    return combined.sort((a, b) => a.answerDate.getTime() - b.answerDate.getTime());

    } catch(error) {
      throw new Error('Error during History-fetch')
    }
  }



}