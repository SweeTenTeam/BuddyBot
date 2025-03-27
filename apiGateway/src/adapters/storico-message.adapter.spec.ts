import { Test, TestingModule } from '@nestjs/testing';
import { StoricoMessageAdapter } from './storico-message.adapter';
import { RabbitMQService } from '../infrastructure/rabbitmq/rabbitmq.service';
import { RequestChatCMD } from '../core/domain/request-chat-cmd';
import { Chat } from '../core/domain/chat';

describe('StoricoMessageAdapter', () => {
  let adapter: StoricoMessageAdapter;
  let rabbitMQService: RabbitMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoricoMessageAdapter,
        {
          provide: RabbitMQService,
          useValue: {
            sendToQueue: jest.fn(),
          },
        },
      ],
    }).compile();

    adapter = module.get<StoricoMessageAdapter>(StoricoMessageAdapter);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should retrieve chat history', async () => {
    const req: RequestChatCMD = { id: '123', numChat: 5 };
    const chatHistory: Chat[] = [{ id: '123', question: { content: 'Hello?', timestamp: '2024-01-01T12:00:00Z' }, answer: { content: 'Hi!', timestamp: '2024-01-01T12:01:00Z' } }];
    jest.spyOn(rabbitMQService, 'sendToQueue').mockResolvedValue(chatHistory);

    const result = await adapter.getStorico(req);

    expect(rabbitMQService.sendToQueue).toHaveBeenCalledWith('storico_queue', req);
    expect(result).toEqual(chatHistory);
  });

  it('should save chat history', async () => {
    const chat: Chat = { id: '123', question: { content: 'Hello?', timestamp: '2024-01-01T12:00:00Z' }, answer: { content: 'Hi!', timestamp: '2024-01-01T12:01:00Z' } };
    jest.spyOn(rabbitMQService, 'sendToQueue').mockResolvedValue(chat);

    const result = await adapter.postStorico(chat);

    expect(rabbitMQService.sendToQueue).toHaveBeenCalledWith('storico_save_queue', expect.any(Object));
    expect(result).toEqual(chat);
  });
});
