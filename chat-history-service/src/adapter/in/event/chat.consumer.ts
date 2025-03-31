import { Controller, Inject } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateChatDTO } from "../dto/CreateChatDTO";
import { IC_USE_CASE, InsertChatUseCase } from "src/application/port/in/insertChat-usecase.port";
import { InsertChatCmd } from "src/domain/insertChatCmd";
import { ChatDTO } from "../dto/ChatDTO";

@Controller()
export class ChatConsumer {
    constructor(@Inject(IC_USE_CASE) private readonly insertChatService: InsertChatUseCase) {}

    @MessagePattern('chat_message')
    async handleMessage(@Payload() data: ChatDTO): Promise<ChatDTO> {
        const insertChatCmd: InsertChatCmd = { 
            question: data.question.content,
            answer: data.answer.content,
            date: data.question.timestamp
        }
        const newMessage = await this.insertChatService.insertChat(insertChatCmd);
        return newMessage;
    }
}

/* richiesta insert simulata rmq
{
  "pattern": "chat_message",
  "data": {
    "question": "Che anno precede il 2025?",
    "answer": "2024",
    "date": "2025-03-29T12:13:00.000Z"
  }
}
*/