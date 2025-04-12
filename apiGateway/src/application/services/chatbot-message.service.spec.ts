import { Test, TestingModule } from '@nestjs/testing';
import { GetRispostaService } from './chatbot-message.service';
import { ChatBotPort } from '../ports/out/chatbot.port';
import { StoricoPort } from '../ports/out/storico.port';
import { ReqAnswerCmd } from '../../domain/cmds/req-answer-cmd';
import { ProvChat } from '../../domain/business/prov-chat';
import { Chat } from '../../domain/business/chat';
import { Message } from '../../domain/business/message';

describe('GetRispostaService', () => {
  let service: GetRispostaService;
  let mockChatBotPort: jest.Mocked<ChatBotPort>;
  let mockStoricoPort: jest.Mocked<StoricoPort>;

  beforeEach(async () => {
    mockChatBotPort = {
      getRisposta: jest.fn(),
    };
    mockStoricoPort = {
      postStorico: jest.fn(),
      getStorico: jest.fn(),
      postUpdate: jest.fn(),
      getLastUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetRispostaService,
        {
          provide: 'ChatBotPort',
          useValue: mockChatBotPort,
        },
        {
          provide: 'StoricoPort',
          useValue: mockStoricoPort,
        },
      ],
    }).compile();

    service = module.get<GetRispostaService>(GetRispostaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should get response from chatbot and store it with timestamp', async () => {
      const req = new ReqAnswerCmd('test question', '2023-01-01T00:00:00.000Z');
      const provChatResponse = new ProvChat(
        'test question',
        'test answer',
        '2023-01-01T00:00:00.000Z'
      );
      const expectedChat = new Chat(
        'generated-id', // This would come from the port implementation
        new Message('test question', '2023-01-01T00:00:00.000Z'),
        new Message('test answer', '2023-01-01T00:00:00.000Z'),
        '2023-01-01T00:00:00.000Z'
      );

      mockChatBotPort.getRisposta.mockResolvedValue(provChatResponse);
      mockStoricoPort.postStorico.mockResolvedValue(expectedChat);

      const result = await service.execute(req);

      expect(mockChatBotPort.getRisposta).toHaveBeenCalledWith(req);
      expect(mockStoricoPort.postStorico).toHaveBeenCalledWith(provChatResponse);
      expect(result).toEqual(expectedChat);
    });

    it('should generate timestamp if not provided', async () => {
      const req = new ReqAnswerCmd('test question', '');
      const provChatResponse = new ProvChat('test question', 'test answer', '');
      const mockDate = new Date().toISOString();

      jest.spyOn(global, 'Date').mockImplementation(() => new Date(mockDate));

      mockChatBotPort.getRisposta.mockResolvedValue(provChatResponse);
      mockStoricoPort.postStorico.mockImplementation((chat) => {
        const expectedProvChat = new ProvChat(
          chat.question,
          chat.answer,
          mockDate
        );
        return Promise.resolve(
          new Chat(
            'generated-id',
            new Message(chat.question, mockDate),
            new Message(chat.answer, mockDate),
            '2023-01-01T00:00:00.000Z'
          )
        );
      });

      const result = await service.execute(req);

      expect(result.question.timestamp).toBe(mockDate);
      expect(result.answer.timestamp).toBe(mockDate);
    });
  });
});