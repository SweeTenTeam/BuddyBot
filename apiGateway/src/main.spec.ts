import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

describe('Main.ts (Bootstrap)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('L\'applicazione NestJS si avvia correttamente', async () => {
    expect(app).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
