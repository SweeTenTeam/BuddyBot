import { Injectable } from '@nestjs/common';
import { rabbitMQConfig } from './rabbit.options';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';

@Injectable()
export class ProducerService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create(rabbitMQConfig());
  }

  async sendMessage(pattern: string, data: any) {
    return this.client.send(pattern, data).toPromise(); //lastValueFrom (?)
  }
}
