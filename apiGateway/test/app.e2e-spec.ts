import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { RabbitMQService } from '../src/infrastructure/rabbitmq/rabbitmq.service';
import { RabbitMQServiceMock } from '../src/infrastructure/rabbitmq/__mocks__/rabbitmq.service';

describe('API End-to-End Tests (Mock RabbitMQ)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RabbitMQService)
      .useValue(RabbitMQServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    
    jest.clearAllMocks();
    jest.resetAllMocks();
    
    await app.close();
  });

  it('/api/get-storico/:id (GET) should return chat history', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/get-storico/user123?num=1')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('question');
    expect(response.body[0]).toHaveProperty('answer');
  });

  it('/api/get-risposta (POST) should return chatbot response', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/get-risposta')
      .send({ text: 'Ciao' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('question');
    expect(response.body).toHaveProperty('answer');
    expect(response.body.answer.content).toBe('Risposta mockata');
  });
});
