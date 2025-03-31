import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { GetStoricoService } from '../../../application/services/storico-message.service';
import { GetRispostaService } from '../../../application/services/chatbot-message.service';
import { ReqAnswerDTO } from '../dtos/req-answer.dto';

describe('ApiController', () => {
  let controller: ApiController;
  let GetStoricoService: GetStoricoService;
  let GetRispostaService: GetRispostaService;

  beforeEach(async () => {
    const mockGetStoricoService = {
      execute: jest.fn(),
    };
    const mockGetRispostaService = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        { provide: GetStoricoService, useValue: mockGetStoricoService },
        { provide: GetRispostaService, useValue: mockGetRispostaService },
      ],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    GetStoricoService = module.get<GetStoricoService>(GetStoricoService);
    GetRispostaService = module.get<GetRispostaService>(GetRispostaService);
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
      
      GetStoricoService.execute = jest.fn().mockResolvedValue(mockResponse);
      const result = await controller.getStorico('123'); 
      
      expect(GetStoricoService.execute).toHaveBeenCalledWith({ id: '123', numChat: 1 });
      expect(result).toEqual(mockResponse);
    });
  
    it('dovrebbe restituire un array vuoto se lo storico è vuoto', async () => {
      GetStoricoService.execute = jest.fn().mockResolvedValue([]);
  
      const result = await controller.getStorico('123', 2);
      expect(result).toEqual([]); 
    });
  
    it('dovrebbe lanciare un errore se lo storico ha dati malformati', async () => {
      GetStoricoService.execute = jest.fn().mockResolvedValue([{ id: '123' }]); 
    
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
  
      GetRispostaService.execute = jest.fn().mockResolvedValue(mockResponse);
  
      const result = await controller.getRisposta(mockRequest);
      expect(GetRispostaService.execute).toHaveBeenCalledWith({
        text: 'Ciao',
        date: expect.any(String), 
      });
      expect(result).toEqual(mockResponse);
    });
  
    it('dovrebbe gestire il caso in cui `GetRispostaService.execute` restituisce null', async () => {
      GetRispostaService.execute = jest.fn().mockResolvedValue(null);
    
      await expect(controller.getRisposta({ text: 'Ciao', date: ' ' })).rejects.toThrow(
        'Risposta non valida dal microservizio.' 
      );
    });
    
  
    it('dovrebbe gestire il caso in cui la risposta del backend è malformata', async () => {
      GetRispostaService.execute = jest.fn().mockResolvedValue({ id: '789' }); // Manca question/answer
  
      await expect(controller.getRisposta({ text: 'Ciao', date:' '  })).rejects.toThrow(
        'Risposta non valida dal microservizio.'
      );
    });
  });
  

});
