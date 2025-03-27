import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { GetStoricoUseCase } from '../../core/services/get-storico.use-case';
import { GetRispostaUseCase } from '../../core/services/get-risposta.use-case';
import { ReqAnswerDTO } from '../../core/domain/req-answer.dto';

describe('ApiController', () => {
  let controller: ApiController;
  let getStoricoUseCase: GetStoricoUseCase;
  let getRispostaUseCase: GetRispostaUseCase;

  beforeEach(async () => {
    const mockGetStoricoUseCase = {
      execute: jest.fn(),
    };
    const mockGetRispostaUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        { provide: GetStoricoUseCase, useValue: mockGetStoricoUseCase },
        { provide: GetRispostaUseCase, useValue: mockGetRispostaUseCase },
      ],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    getStoricoUseCase = module.get<GetStoricoUseCase>(GetStoricoUseCase);
    getRispostaUseCase = module.get<GetRispostaUseCase>(GetRispostaUseCase);
  });

  it('dovrebbe essere definito', () => {
    expect(controller).toBeDefined();
  });

  describe('getStorico', () => {
    it('dovrebbe usare 1 come valore di default per numChat se non fornito', async () => {
      const mockResponse = [
        {
          id: '123',
          question: { content: 'Ciao', timestamp: '2024-03-24T10:00:00Z' },
          answer: { content: 'Salve!', timestamp: '2024-03-24T10:01:00Z' },
        },
      ];
      
      getStoricoUseCase.execute = jest.fn().mockResolvedValue(mockResponse);
      const result = await controller.getStorico('123'); 
      
      expect(getStoricoUseCase.execute).toHaveBeenCalledWith({ id: '123', numChat: 1 });
      expect(result).toEqual(mockResponse);
    });
  
    it('dovrebbe restituire un array vuoto se lo storico è vuoto', async () => {
      getStoricoUseCase.execute = jest.fn().mockResolvedValue([]);
  
      const result = await controller.getStorico('123', 2);
      expect(result).toEqual([]); 
    });
  
    it('dovrebbe lanciare un errore se lo storico ha dati malformati', async () => {
      getStoricoUseCase.execute = jest.fn().mockResolvedValue([{ id: '123' }]); 
    
      await expect(controller.getStorico('123', 1)).rejects.toThrow(
        "La risposta del microservizio storico non è valida." 
      );
    });
    
  });
  
  describe('getRisposta', () => {
    it('dovrebbe aggiungere la data corrente se `date` è undefined', async () => {
      const mockRequest: ReqAnswerDTO = { text: 'Ciao', date: '' };
      const mockResponse = {
        id: '789',
        question: { content: 'Ciao', timestamp: '2024-03-24T10:00:00Z' },
        answer: { content: 'Ciao anche a te!', timestamp: '2024-03-24T10:01:00Z' },
      };
  
      getRispostaUseCase.execute = jest.fn().mockResolvedValue(mockResponse);
  
      const result = await controller.getRisposta(mockRequest);
      expect(getRispostaUseCase.execute).toHaveBeenCalledWith({
        text: 'Ciao',
        date: expect.any(String), 
      });
      expect(result).toEqual(mockResponse);
    });
  
    it('dovrebbe gestire il caso in cui `getRispostaUseCase.execute` restituisce null', async () => {
      getRispostaUseCase.execute = jest.fn().mockResolvedValue(null);
    
      await expect(controller.getRisposta({ text: 'Ciao', date: ' ' })).rejects.toThrow(
        'Risposta non valida dal microservizio.' 
      );
    });
    
  
    it('dovrebbe gestire il caso in cui la risposta del backend è malformata', async () => {
      getRispostaUseCase.execute = jest.fn().mockResolvedValue({ id: '789' }); // Manca question/answer
  
      await expect(controller.getRisposta({ text: 'Ciao', date:' '  })).rejects.toThrow(
        'Risposta non valida dal microservizio.'
      );
    });
  });
  

});
