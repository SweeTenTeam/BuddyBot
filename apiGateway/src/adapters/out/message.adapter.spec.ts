import { Test, TestingModule } from '@nestjs/testing';
import { MessageAdapter } from './message.adapter';
import { ChatBotService } from '../../infrastructure/rabbitmq/chatbot.service';
import { ReqAnswerCmd } from '../../domain/cmds/req-answer-cmd';
import { ProvChat } from '../../domain/business/prov-chat';

describe('MessageAdapter', () => {
  let adapter: MessageAdapter;
  let chatbotService: ChatBotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageAdapter,
        {
          provide: ChatBotService,
          useValue: { sendMessage: jest.fn() },
        },
      ],
    }).compile();

    adapter = module.get<MessageAdapter>(MessageAdapter);
    chatbotService = module.get<ChatBotService>(ChatBotService);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should get risposta from chatbotService', async () => {
    const requestMock = new ReqAnswerCmd('Test Question', '2023-01-01T00:00:00Z');
    const responseMock = new ProvChat('1', requestMock.text, 'Test Answer');
    jest.spyOn(chatbotService, 'sendMessage').mockResolvedValue(responseMock);

    const result = await adapter.getRisposta(requestMock);
    expect(result).toEqual(responseMock);
    expect(chatbotService.sendMessage).toHaveBeenCalledWith('get-answer', requestMock);
  });
});
