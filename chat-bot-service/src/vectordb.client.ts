import { Injectable } from '@nestjs/common';
import { rabbitMQConfig } from './vectordb.rabbit.options.js';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';

@Injectable()
export class VectorDbClient {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create(rabbitMQConfig());
  }

  async sendMessage(pattern: string, data: any) {
    console.log("Sending message to Information Service");
    return this.client.send(pattern, data).toPromise(); //lastValueFrom (?)
  }
  
}
