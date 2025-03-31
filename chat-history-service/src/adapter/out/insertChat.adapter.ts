import { Chat } from 'src/domain/chat';
import { InsertChatPort } from '../../application/port/out/insertChat.port';
import { InsertChatCmd } from '../../domain/insertChatCmd';
import { ChatRepository } from './persistence/chat.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InsertChatAdapter implements InsertChatPort {
    constructor(private readonly insertRepository: ChatRepository) { }

    async insertChat(cmd: InsertChatCmd): Promise<Chat> {
        console.log("Date for insert chat: "+ new Date(cmd.question.timestamp));
        return await this.insertRepository.insertChat(cmd.question.content, cmd.answer.content, new Date(cmd.question.timestamp));
    }
}