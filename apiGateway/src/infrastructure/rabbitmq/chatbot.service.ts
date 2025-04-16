import { Injectable } from '@nestjs/common';
import { rabbitMQConfig } from './chatbot.rabbit.options';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';

@Injectable()
export class ChatBotService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create(rabbitMQConfig());
  }

  async sendMessage(pattern: string, data: any) {
    console.log("Sending message to ChatBot");
    return this.client.send(pattern, data).toPromise(); //lastValueFrom (?)
  }
  
}
