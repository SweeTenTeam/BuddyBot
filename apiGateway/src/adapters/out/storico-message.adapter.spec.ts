import { Test, TestingModule } from '@nestjs/testing';
import { StoricoMessageAdapter } from './storico-message.adapter';
import { HistoryService } from '../../infrastructure/rabbitmq/history.service';
import { RequestChatCMD } from '../../domain/cmds/request-chat-cmd';
import { Chat } from '../../domain/business/chat';
import { ProvChat } from '../../domain/business/prov-chat';
import { Message } from '../../domain/business/message';
import { LastUpdateCMD } from '../../domain/cmds/LastUpdateCMD';

describe('StoricoMessageAdapter', () => {
  let adapter: StoricoMessageAdapter;
  let historyService: jest.Mocked<HistoryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoricoMessageAdapter,
        {
          provide: HistoryService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    adapter = module.get<StoricoMessageAdapter>(StoricoMessageAdapter);
    historyService = module.get<HistoryService>(HistoryService) as unknown as jest.Mocked<HistoryService>;
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should get storico from historyService and map to Chat instances', async () => {
    const requestMock = new RequestChatCMD('1', 2);
    const rawResponse = [{
      id: '1',
      question: new Message('Test Question', '2023-01-01T00:00:00Z'),
      answer: new Message('Test Answer', '2023-01-01T00:00:00Z'),
      lastFetch: '2023-01-01T00:00:00Z',
    }];
    historyService.sendMessage.mockResolvedValue(rawResponse);

    const result = await adapter.getStorico(requestMock);

    expect(historyService.sendMessage).toHaveBeenCalledWith('fetch_queue', requestMock);
    expect(result).toEqual([
      expect.any(Chat),
    ]);
  });

  it('should post storico to historyService and return Chat', async () => {
    const chatMock = new ProvChat('1', 'Test Question', 'Test Answer');

    const rawResponse = {
      id: '1',
      question: {
        content: 'Test Question',
        timestamp: '2023-01-01T00:00:00Z',
      },
      answer: {
        content: 'Test Answer',
        timestamp: '2023-01-01T00:00:00Z',
      },
      lastFetch: '2023-01-01T00:00:00Z',
    };
    historyService.sendMessage.mockResolvedValue(rawResponse);

    const result = await adapter.postStorico(chatMock);

    expect(historyService.sendMessage).toHaveBeenCalledWith('chat_message', chatMock);
    expect(result).toBeInstanceOf(Chat);
    expect(result.question).toBeInstanceOf(Message);
    expect(result.answer).toBeInstanceOf(Message);
  });

  it('should post last fetch to historyService', async () => {
    const lastFetchCmd = new LastUpdateCMD('2023-01-01T00:00:00Z');
    historyService.sendMessage.mockResolvedValue(true);

    const result = await adapter.postUpdate(lastFetchCmd);

    expect(historyService.sendMessage).toHaveBeenCalledWith('lastFetch_queue', lastFetchCmd);
    expect(result).toBe(true);
  });

  it('should get last fetch date from historyService', async () => {
    const expected = new LastUpdateCMD('2023-01-01T00:00:00Z');
    historyService.sendMessage.mockResolvedValue(expected);

    const result = await adapter.getLastUpdate();

    expect(historyService.sendMessage).toHaveBeenCalledWith('getLastUpdate_queue', '');
    expect(result).toEqual(expected);
  });
});
