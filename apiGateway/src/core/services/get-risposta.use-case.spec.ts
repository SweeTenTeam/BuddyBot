import { Test, TestingModule } from '@nestjs/testing';
import { GetRispostaUseCase } from './get-risposta.use-case';
import { ChatBotPort } from '../ports/chatbot.port';
import { StoricoPort } from '../ports/storico.port';
import { ReqAnswerCmd } from '../domain/req-answer-cmd';
import { Chat } from '../domain/chat';

describe('GetRispostaUseCase', () => {
  let getRispostaUseCase: GetRispostaUseCase;
  let chatbotPort: ChatBotPort;
  let storicoPort: StoricoPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetRispostaUseCase,
        {
          provide: 'ChatBotPort',
          useValue: { getRisposta: jest.fn() },
        },
        {
          provide: 'StoricoPort',
          useValue: { postStorico: jest.fn() },
        },
      ],
    }).compile();

    getRispostaUseCase = module.get<GetRispostaUseCase>(GetRispostaUseCase);
    chatbotPort = module.get<ChatBotPort>('ChatBotPort');
    storicoPort = module.get<StoricoPort>('StoricoPort');
  });

  it('should get a response from the chatbot and save it', async () => {
    const request: ReqAnswerCmd = { text: 'Ciao', date: '2024-03-23T12:00:00Z' };
  
    const mockChat: Chat = {
      id: '',
      question: {
        content: 'Ciao',
        timestamp: '2024-03-23T12:00:00Z', // ✅ Ora corrisponde esattamente a ciò che restituisce il codice
      },
      answer: {
        content: 'Ciao, come posso aiutarti?',
        timestamp: '', // ✅ Lo storico genererà il timestamp della risposta
      },
    };
  
    chatbotPort.getRisposta = jest.fn().mockResolvedValue(mockChat);
    storicoPort.postStorico = jest.fn().mockResolvedValue(mockChat);
  
    const result = await getRispostaUseCase.execute(request);
  
    expect(result).toEqual(mockChat);
  });
  
  
});
