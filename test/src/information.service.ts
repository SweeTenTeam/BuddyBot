import { Injectable } from '@nestjs/common';
import { rabbitMQConfig } from './information.rabbit.options';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';

@Injectable()
export class InformationService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create(rabbitMQConfig());
  }

  async sendMessage(pattern: string, data: any) {
    return this.client.send(pattern, data).toPromise(); //lastValueFrom (?)
  }
}
