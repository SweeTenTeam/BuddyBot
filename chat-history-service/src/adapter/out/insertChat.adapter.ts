import { Chat } from 'src/domain/chat';
import { InsertChatPort } from '../../application/port/out/insertChat.port';
import { InsertChatCmd } from '../../domain/insertChatCmd';
import { ChatRepository } from './persistence/chat.repository';
import { Injectable } from '@nestjs/common';
import { Message } from 'src/domain/message';

@Injectable()
export class InsertChatAdapter implements InsertChatPort {
    constructor(private readonly insertRepository: ChatRepository) { }

    async insertChat(cmd: InsertChatCmd): Promise<Chat> {
        console.log("Date for insert chat: "+ new Date(cmd.question.timestamp));
        const newChat = await this.insertRepository.insertChat(cmd.question.content, cmd.answer.content, new Date(cmd.question.timestamp));
        const chat = new Chat(newChat.id,new Message(newChat.question,newChat.questionDate.toISOString()),new Message(newChat.answer,newChat.answerDate.toISOString()), newChat.lastFetch);
        return chat
    }
}