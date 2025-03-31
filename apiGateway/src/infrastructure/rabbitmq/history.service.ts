import { Injectable } from '@nestjs/common';
import { rabbitMQConfig } from './history.rabbit.options';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';

@Injectable()
export class HistoryService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create(rabbitMQConfig());
  }

  async sendMessage(pattern: string, data: any) {
    console.log("Sending");
    return this.client.send(pattern, data).toPromise(); //lastValueFrom (?)
  }
  
}
