import { Injectable } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class RabbitMQService {
    private client: ClientProxy;

    constructor() {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://guest:guest@localhost:5672'],
                queue: 'chat_queue',
                queueOptions: {
                    durable: false,
                }
            }
        })
    }

    sendMessage(data: { message: string }) {
        return this.client.send('chat_message', data).toPromise()
    }
}