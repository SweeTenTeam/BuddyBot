import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { Transport, ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { AppModule } from '../../src/app.module';
import { firstValueFrom } from 'rxjs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatEntity } from '../../src/adapter/out/persistence/chat-entity';
import { Repository } from 'typeorm';

describe('InsertChat (integration)', () => {
  let app: INestMicroservice;
  let client: ClientProxy;
  let chatRepository: Repository<ChatEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'chat_queue',
        queueOptions: {
          durable: false,
        },
      },
    });

    await app.listen();

    client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'chat_queue',
        queueOptions: {
          durable: false,
        },
      },
    });

    chatRepository = moduleFixture.get<Repository<ChatEntity>>(
      getRepositoryToken(ChatEntity),
    );

    await new Promise((res) => setTimeout(res, 1000));
  });

  beforeEach(async () => {
    await chatRepository.clear();
  });

  it('should insert a chat message and return the full DTO', async () => {
    const payload = {
      question: 'Che anno precede il 2025?',
      answer: '2024',
      date: new Date().toISOString(),
    };

    const result = await firstValueFrom(
      client.send('chat_message', payload),
    );

    expect(result).toHaveProperty('id');
    expect(result.question).toBe(payload.question);
    expect(result.answer).toBe(payload.answer);

    const saved = await chatRepository.findOneBy({ question: payload.question });

    expect(saved).toBeDefined();
    expect(saved?.answer).toBe(payload.answer);
  });

  afterAll(async () => {
    await client.close();
    await app.close();
  });
});
