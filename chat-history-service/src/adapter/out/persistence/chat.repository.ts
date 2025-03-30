import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, DataSource, LessThanOrEqual } from 'typeorm';
import { ChatEntity } from './chat-entity';
import { Chat } from 'src/domain/chat';
import { Message } from 'src/domain/message';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepo: Repository<ChatEntity>,
  ) {}

  async insertChat(question: string, answer: string, date: Date): Promise<Chat> {
    const newChat: ChatEntity = this.chatRepo.create({ question, questionDate: date, answer });
    await this.chatRepo.save(newChat);
    console.log(newChat)
    console.log("Vamos")
    return new Chat(newChat.id,new Message(newChat.question,newChat.questionDate.toISOString()),new Message(newChat.answer,newChat.answerDate.toISOString()));
  }

  async fetchStoricoChat(lastChatId: string, numChat?: number): Promise<ChatEntity[]> {
  try {
    const take = numChat ? numChat : 5;

    //caso senza ID (quindi primo accesso)
    if (!lastChatId) {
      const lastChats = await this.chatRepo.find({
        order: { answerDate: 'DESC' },
        take,
      });
      return lastChats.slice().reverse()
    }

    //caso con ID trovo e prendo la prima chat e poi le n-1 rimanenti
    const lastChat = await this.chatRepo.findOne({
      where: { id: lastChatId },
    });

    if (!lastChat) {
      throw new Error('Last chat ID not found');
    }

    const previousChats = await this.chatRepo.find({
      where: {
        answerDate: LessThan(lastChat.answerDate),
      },
      order: { answerDate: 'DESC' },
      take: take - 1,
    });
    const combo = previousChats.slice().reverse()
    return combo;

  } catch (error) {
    console.error('Error during History-fetch:', error);
    throw new Error('Error during History-fetch');
  }
}


}