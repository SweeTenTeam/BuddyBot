import { Test, TestingModule } from '@nestjs/testing';
import { GetStoricoUseCase } from './get-storico.use-case';
import { StoricoPort } from '../ports/storico.port';
import { RequestChatCMD } from '../domain/request-chat-cmd';
import { Chat } from '../domain/chat';

describe('GetStoricoUseCase', () => {
  let getStoricoUseCase: GetStoricoUseCase;
  let storicoPort: StoricoPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStoricoUseCase,
        {
          provide: 'StoricoPort',
          useValue: { getStorico: jest.fn() }, // ✅ Mock della funzione
        },
      ],
    }).compile();

    getStoricoUseCase = module.get<GetStoricoUseCase>(GetStoricoUseCase);
    storicoPort = module.get<StoricoPort>('StoricoPort');
  });

  it('should get chat history from StoricoPort', async () => {
    const request: RequestChatCMD = { id: 'user123', numChat: 2 };

    const mockChatHistory: Chat[] = [
      {
        id: 'chat1',
        question: { content: 'Ciao', timestamp: '2024-03-23T12:00:00Z' },
        answer: { content: 'Ciao, come posso aiutarti?', timestamp: '2024-03-23T12:01:00Z' },
      },
      {
        id: 'chat2',
        question: { content: 'Come stai?', timestamp: '2024-03-23T12:05:00Z' },
        answer: { content: 'Bene, grazie!', timestamp: '2024-03-23T12:06:00Z' },
      },
    ];

    storicoPort.getStorico = jest.fn().mockResolvedValue(mockChatHistory); // ✅ Simuliamo la risposta

    const result = await getStoricoUseCase.execute(request);

    expect(result).toEqual(mockChatHistory);
    expect(storicoPort.getStorico).toHaveBeenCalledWith(request);
  });
});
