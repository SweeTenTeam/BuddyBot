import { InsertChatPort } from '../../application/port/out/insertChat.port';
import { InsertChatCmd } from '../../domain/insertChatCmd';
import { ChatRepository } from './persistence/chat.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InsertChatAdapter implements InsertChatPort {
    constructor(private readonly insertRepository: ChatRepository) { }

    insertChat(cmd: InsertChatCmd): Promise<boolean> {
        return this.insertRepository.insertChat(cmd.question, cmd.answer, cmd.date);
    }
}