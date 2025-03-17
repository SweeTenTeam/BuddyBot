//ESEMPIO TEST
/*

import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotService } from './chatbot.service';
import { StoricoMessageService } from './storico-message.service';
import { ReqAnswerDTO } from '../dtos/req-answer.dto';
import { ChatDTO } from '../interfaces/chat.dto';

describe('ChatbotService', () => {
  let service: ChatbotService;
  let mockStoricoMessageService: jest.Mocked<StoricoMessageService>;

  beforeEach(async () => {
    mockStoricoMessageService = { saveToStorico: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatbotService,
        { provide: StoricoMessageService, useValue: mockStoricoMessageService },
      ],
    }).compile();

    service = module.get<ChatbotService>(ChatbotService);
  });

  it('should save the question and answer to the storico', async () => {
    const req: ReqAnswerDTO = { id: '123', text: 'Ciao!', date: new Date() };
    const mockResponse = { answer: 'Ciao, come posso aiutarti?' };

    jest.spyOn(service['rabbitMQAdapter'], 'sendMessage').mockResolvedValue(mockResponse);

    const result = await service.getRisposta(req);

    expect(mockStoricoMessageService.saveToStorico).toHaveBeenCalledWith({
      id: '123',
      question: 'Ciao!',
      answer: 'Ciao, come posso aiutarti?',
      date: expect.any(Date),
    });
    expect(result).toEqual({
      id: '123',
      question: 'Ciao!',
      answer: 'Ciao, come posso aiutarti?',
      date: expect.any(Date),
    });
  });
});
*/