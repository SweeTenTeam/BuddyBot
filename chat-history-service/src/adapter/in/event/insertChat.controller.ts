import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";
import { CreateChatDTO } from "../dto/CreateChatDTO";

@Controller('api/chat')
export class insertChatController {
    constructor(private readonly rabbitMqService: RabbitMQService) { }

    @Post('send')
    async sendMessage(@Body() data: CreateChatDTO) {
        if (!data) throw new BadRequestException('Body is missing.')
        const chat = await this.rabbitMqService.sendMessage(data)
        /*return { chat: chat.message }*/
    }
}