import { Body, Controller, Post } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";

@Controller('api/chat')
export class ChatController {
    constructor(private readonly rabbitMqService: RabbitMQService) { }

    @Post('send')
    async sendMessage(@Body() data: { message: string }) {
        if (!data) return { message: '' }
        const message = await this.rabbitMqService.sendMessage(data)
        return { message: message.response }
    }
}