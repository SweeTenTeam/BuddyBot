import { Controller, Inject } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateChatDTO } from "../dto/CreateChatDTO";
import { IC_USE_CASE, InsertChatUseCase } from "src/application/port/in/insertChat-usecase.port";
import { InsertChatService } from "src/application/insertChat.service";
import { InsertChatCmd } from "src/domain/insertChatCmd";

@Controller()
export class ChatConsumer {
    constructor(@Inject(IC_USE_CASE) private readonly insertChatService: InsertChatUseCase) {}
    @MessagePattern('chat_message')
    handleMessage(@Payload() data: CreateChatDTO) {
        const insertChatCmd: InsertChatCmd = { 
            question: data.question,
            answer: data.answer,
            date: data.date
        }
        this.insertChatService.insertChat(insertChatCmd)
    }
}