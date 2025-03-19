import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class ChatConsumer {
    @MessagePattern('chat_message')
    handleMessage(@Payload() data: { message: string }) {
        console.log('message:', data.message);
        return {
            response: data.message
        }
    }
}