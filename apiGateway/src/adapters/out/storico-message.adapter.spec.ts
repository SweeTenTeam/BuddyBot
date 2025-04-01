import { Test, TestingModule } from '@nestjs/testing';
import { StoricoMessageAdapter } from './storico-message.adapter';
import { HistoryService } from '../../infrastructure/rabbitmq/history.service';
import { RequestChatCMD } from '../../domain/cmds/request-chat-cmd';
import { Chat } from '../../domain/business/chat';
import { ProvChat } from '../../domain/business/prov-chat';
import { Message } from '../../domain/business/message';

describe('StoricoMessageAdapter', () => {
  let adapter: StoricoMessageAdapter;
  let historyService: HistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoricoMessageAdapter,
        {
          provide: HistoryService,
          useValue: { sendMessage: jest.fn() },
        },
      ],
    }).compile();

    adapter = module.get<StoricoMessageAdapter>(StoricoMessageAdapter);
    historyService = module.get<HistoryService>(HistoryService);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should get storico from historyService', async () => {
    const requestMock = new RequestChatCMD('1', 2);
    const responseMock = [new Chat('1', new Message('Test Question', '2023-01-01T00:00:00Z'), new Message('Test Answer', '2023-01-01T00:00:00Z'))];
    jest.spyOn(historyService, 'sendMessage').mockResolvedValue(responseMock);

    const result = await adapter.getStorico(requestMock);
    expect(result).toEqual(responseMock);
    expect(historyService.sendMessage).toHaveBeenCalledWith('fetch_queue', requestMock);
  });

  it('should post storico to historyService', async () => {
    const chatMock = new ProvChat('1', 'Test Question', 'Test Answer');
    const responseMock = new Chat('1', new Message('Test Question', '2023-01-01T00:00:00Z'), new Message('Test Answer', '2023-01-01T00:00:00Z'));
    jest.spyOn(historyService, 'sendMessage').mockResolvedValue(responseMock);

    const result = await adapter.postStorico(chatMock);
    expect(result).toEqual(responseMock);
    expect(historyService.sendMessage).toHaveBeenCalledWith('chat_message', chatMock);
  });
});
