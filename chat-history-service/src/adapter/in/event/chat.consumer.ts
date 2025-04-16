import { Controller, Inject } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateChatDTO } from "../dto/CreateChatDTO";
import { IC_USE_CASE, InsertChatUseCase } from "src/application/port/in/insertChat-usecase.port";
import { InsertChatCmd } from "src/domain/insertChatCmd";
import { ChatDTO } from "../dto/ChatDTO";
import { Message } from "src/domain/message";

@Controller()
export class ChatConsumer {
    constructor(@Inject(IC_USE_CASE) private readonly insertChatService: InsertChatUseCase) {}

    @MessagePattern('chat_message')
    async handleMessage(@Payload() data: CreateChatDTO): Promise<ChatDTO> {
        const insertChatCmd: InsertChatCmd = { 
            question: new Message(data.question, data.timestamp),
            answer: { content: data.answer }
        }
        const newMessage = await this.insertChatService.insertChat(insertChatCmd);
        return newMessage;
    }
}