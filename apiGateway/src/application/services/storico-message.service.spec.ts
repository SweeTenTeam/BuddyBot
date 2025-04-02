import { Test, TestingModule } from '@nestjs/testing';
import { GetStoricoService } from './storico-message.service';
import { StoricoPort } from '../ports/out/storico.port';
import { RequestChatCMD } from '../../domain/cmds/request-chat-cmd';
import { Chat } from '../../domain/business/chat';
import { Message } from '../../domain/business/message';

describe('GetStoricoService', () => {
  let service: GetStoricoService;
  let mockStoricoPort: jest.Mocked<StoricoPort>;

  beforeEach(async () => {
    mockStoricoPort = {
      getStorico: jest.fn(),
      postStorico: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStoricoService,
        {
          provide: 'StoricoPort',
          useValue: mockStoricoPort,
        },
      ],
    }).compile();

    service = module.get<GetStoricoService>(GetStoricoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should call storicoPort.getStorico with the request and return chats', async () => {
      const req = new RequestChatCMD('test-uuid', 10);
      const expectedChats = [
        new Chat(
          'chat-1',
          new Message('question 1', '2023-01-01T00:00:00.000Z'),
          new Message('answer 1', '2023-01-01T00:00:01.000Z')
        ),
      ];

      mockStoricoPort.getStorico.mockResolvedValue(expectedChats);

      const result = await service.execute(req);

      expect(mockStoricoPort.getStorico).toHaveBeenCalledWith(req);
      expect(result).toEqual(expectedChats);
    });

    it('should return empty array if no history found', async () => {
      const req = new RequestChatCMD('test-uuid', 10);

      mockStoricoPort.getStorico.mockResolvedValue([]);

      const result = await service.execute(req);

      expect(result).toEqual([]);
    });
  });
});