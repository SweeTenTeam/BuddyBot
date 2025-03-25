import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { GetStoricoUseCase } from '../../core/services/get-storico.use-case';
import { GetRispostaUseCase } from '../../core/services/get-risposta.use-case';
//import { RequestChatDTO } from '../../core/domain/request-chat.dto';
import { ReqAnswerDTO } from '../../core/domain/req-answer.dto';
import { ChatDTO } from '../../core/domain/chat.dto';

describe('ApiController', () => {
  let apiController: ApiController;
  let getStoricoUseCase: GetStoricoUseCase;
  let getRispostaUseCase: GetRispostaUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        { provide: GetStoricoUseCase, useValue: { execute: jest.fn() } },
        { provide: GetRispostaUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    apiController = module.get<ApiController>(ApiController);
    getStoricoUseCase = module.get<GetStoricoUseCase>(GetStoricoUseCase);
    getRispostaUseCase = module.get<GetRispostaUseCase>(GetRispostaUseCase);
  });

  it('should get chat history from GetStoricoUseCase', async () => {
    const mockStorico: ChatDTO[] = [
      {
        id: 'chat1',
        question: { content: 'Ciao', timestamp: '2024-03-23T12:00:00Z' },
        answer: { content: 'Ciao, come posso aiutarti?', timestamp: '2024-03-23T12:01:00Z' },
      },
    ];

    getStoricoUseCase.execute = jest.fn().mockResolvedValue(mockStorico);

    const result = await apiController.getStorico('user123', 1);

    expect(result).toEqual(mockStorico);
    expect(getStoricoUseCase.execute).toHaveBeenCalledWith({ id: 'user123', numChat: 1 });
  });

  it('should get a chatbot response from GetRispostaUseCase', async () => {
    const req: ReqAnswerDTO = { text: 'Ciao', date: '2024-03-23T12:00:00Z' };

    const mockChat: ChatDTO = {
      id: 'chat123',
      question: { content: 'Ciao', timestamp: '2024-03-23T12:00:00Z' },
      answer: { content: 'Ciao, come posso aiutarti?', timestamp: '2024-03-23T12:01:00Z' },
    };

    getRispostaUseCase.execute = jest.fn().mockResolvedValue(mockChat);

    const result = await apiController.getRisposta(req);

    expect(result).toEqual(mockChat);
    expect(getRispostaUseCase.execute).toHaveBeenCalledWith(req);
  });
});
