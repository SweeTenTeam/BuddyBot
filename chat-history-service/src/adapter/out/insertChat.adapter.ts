import { Chat } from 'src/domain/chat';
import { InsertChatPort } from '../../application/port/out/insertChat.port';
import { InsertChatCmd } from '../../domain/insertChatCmd';
import { ChatDTO } from '../in/dto/ChatDTO';
import { ChatRepository } from './persistence/chat.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InsertChatAdapter implements InsertChatPort {
    constructor(private readonly insertRepository: ChatRepository) { }

    async insertChat(cmd: InsertChatCmd): Promise<Chat> {
        console.log("Date for insert chat: "+ new Date(cmd.date));
        return await this.insertRepository.insertChat(cmd.question, cmd.answer, new Date(cmd.date));
    }
}