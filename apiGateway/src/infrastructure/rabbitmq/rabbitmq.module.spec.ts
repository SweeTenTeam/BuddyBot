import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQModule } from './rabbitmq.module';

describe('RabbitMQModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [RabbitMQModule],
    }).compile();
  });

  it('Il modulo RabbitMQ si carica correttamente', () => {
    expect(module).toBeDefined();
  });
});
