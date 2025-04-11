import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, DataSource, LessThanOrEqual } from 'typeorm';
import { ChatEntity } from './chat-entity';
import { LastUpdateEntity } from './lastFetch-entity';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(ChatEntity) //tabella db della chat
    private readonly chatRepo: Repository<ChatEntity>,

    @InjectRepository(LastUpdateEntity) //tabella db con unico record data ultimo retrieval info
    private readonly lastUpdateRepo: Repository<LastUpdateEntity>,
  ) {}

  async insertChat(question: string, answer: string, date: Date): Promise<ChatEntity> {
    const lastUpdate = await this.lastUpdateRepo.findOne({ where: { id: 1 } });

    if (!lastUpdate) {
      throw new Error('LastUpdate entry not found');
    }

    const newChat: ChatEntity = this.chatRepo.create({
      question,
      questionDate: date,
      answer,
      lastFetch: lastUpdate.lastFetch.toISOString()
    });

    await this.chatRepo.save(newChat);

    console.log(newChat);
    console.log("Vamos");

    return newChat;
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
      take: take,
    });
    const combo = previousChats.slice().reverse()
    return combo;

  } catch (error) {
    console.error('Error during History-fetch:', error);
    throw new Error('Error during History-fetch');
  }
  }

  async insertLastRetrieval(date: string): Promise<boolean> {
  try {
    const parsedDate = new Date(date);
    console.log("HEREEEEEEEEE");
    console.log(date);
    console.log(parsedDate);
    //id sempre 1
    const existing = await this.lastUpdateRepo.findOne({ where: { id: 1 } });

    if (existing) {
      existing.lastFetch = parsedDate;
      await this.lastUpdateRepo.save(existing);
    } else {
      const newEntry = this.lastUpdateRepo.create({
        id: 1,
        lastFetch: parsedDate,
      });
      await this.lastUpdateRepo.save(newEntry);
    }

    return true;

  } catch (error) {
    console.error('Errore durante insertLastRetrieval:', error);
    return false;
  }
  }

  async fetchLastUpdate(): Promise<LastUpdateEntity> {
  const entity = await this.lastUpdateRepo.findOne({ where: { id: 1 } });
  if (!entity) {
    throw new Error('LastUpdate-record not found (in db)');
  }
  return entity;
}

}