import { Test, TestingModule } from '@nestjs/testing';
import { MessageAdapter } from './message.adapter';
import { RabbitMQService } from '../infrastructure/rabbitmq/rabbitmq.service';
import { ReqAnswerCmd } from '../core/domain/req-answer-cmd';
import { ProvChat } from '../core/domain/prov-chat';

describe('MessageAdapter', () => {
  let adapter: MessageAdapter;
  let rabbitMQService: RabbitMQService;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageAdapter,
        {
          provide: RabbitMQService,
          useValue: {
            sendToQueue: jest.fn(),
          },
        },
      ],
    }).compile();

    adapter = module.get<MessageAdapter>(MessageAdapter);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should get a response from the chatbot', async () => {
    const req: ReqAnswerCmd = { text: 'Hello?', date: '2024-01-01T12:00:00Z' };
    const response: ProvChat = { question: 'Hello?', answer: 'Hi!', timestamp: '2024-01-01T12:01:00Z' };
    jest.spyOn(rabbitMQService, 'sendToQueue').mockResolvedValue(response);

    const result = await adapter.getRisposta(req);

    expect(rabbitMQService.sendToQueue).toHaveBeenCalledWith('chatbot_queue', req);
    expect(result).toEqual(response);
  });

  it('should throw an error if request text is empty', async () => {
    await expect(adapter.getRisposta({ text: '', date: '2024-01-01T12:00:00Z' }))
      .rejects
      .toThrow("Il testo della domanda non può essere vuoto");
  });

  it('should throw an error if chatbot response is invalid', async () => {
    const req: ReqAnswerCmd = { text: 'Hello?', date: '2024-01-01T12:00:00Z' };
    jest.spyOn(rabbitMQService, 'sendToQueue').mockResolvedValue(null);

    await expect(adapter.getRisposta(req))
      .rejects
      .toThrow("Risposta non valida dal chatbot");
  });

  it('should log an error if chatbot response is invalid', async () => {
    const req: ReqAnswerCmd = { text: 'Hello?', date: '2024-01-01T12:00:00Z' };
    jest.spyOn(rabbitMQService, 'sendToQueue').mockResolvedValue(null);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    await expect(adapter.getRisposta(req)).rejects.toThrow("Risposta non valida dal chatbot");
  
    expect(consoleErrorSpy).toHaveBeenCalledWith(" Errore: Risposta non valida da RabbitMQ", null);
  
    consoleErrorSpy.mockRestore();
  });
  
  it('should throw an error if chatbot response is missing answer field', async () => {
    const req: ReqAnswerCmd = { text: 'Hello?', date: '2024-01-01T12:00:00Z' };
    jest.spyOn(rabbitMQService, 'sendToQueue').mockResolvedValue({} as ProvChat); 
  
    await expect(adapter.getRisposta(req))
      .rejects
      .toThrow("Risposta non valida dal chatbot");
  });
  
  it('should use the current timestamp if date is missing', async () => {
    const req: ReqAnswerCmd = { text: 'Hello?', date:'' }; 
    const response: ProvChat = { question: 'Hello?', answer: 'Hi!', timestamp: '2024-01-01T12:01:00Z' };
    jest.spyOn(rabbitMQService, 'sendToQueue').mockResolvedValue(response);
    
    const dateSpy = jest.spyOn(global.Date.prototype, 'toISOString').mockReturnValue('2025-01-01T12:00:00Z');
  
    const result = await adapter.getRisposta(req);
  
    expect(rabbitMQService.sendToQueue).toHaveBeenCalledWith('chatbot_queue', {
      text: 'Hello?',
      date: '2025-01-01T12:00:00Z', 
    });
  
    expect(result).toEqual(response);
    dateSpy.mockRestore();
  });
  
  it('should throw an error if RabbitMQ service fails', async () => {
    const req: ReqAnswerCmd = { text: 'Hello?', date: '2024-01-01T12:00:00Z' };
    jest.spyOn(rabbitMQService, 'sendToQueue').mockRejectedValue(new Error("RabbitMQ error"));
  
    await expect(adapter.getRisposta(req))
      .rejects
      .toThrow("RabbitMQ error");
  });

  it('should log the request before sending it', async () => {
    const req: ReqAnswerCmd = { text: 'Hello?', date: '2024-01-01T12:00:00Z' };
    const response: ProvChat = { question: 'Hello?', answer: 'Hi!', timestamp: '2024-01-01T12:01:00Z' };
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  
    jest.spyOn(rabbitMQService, 'sendToQueue').mockResolvedValue(response);
    await adapter.getRisposta(req);
  
    expect(consoleLogSpy).toHaveBeenCalledWith("Richiesta inviata al chatbot:", req);
  
    consoleLogSpy.mockRestore();
  });
  
  it('should log an error when receiving an invalid response', async () => {
    const req: ReqAnswerCmd = { text: 'Hello?', date: '2024-01-01T12:00:00Z' };
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    jest.spyOn(rabbitMQService, 'sendToQueue').mockResolvedValue(null);
    await expect(adapter.getRisposta(req)).rejects.toThrow("Risposta non valida dal chatbot");
  
    expect(consoleErrorSpy).toHaveBeenCalledWith(" Errore: Risposta non valida da RabbitMQ", null);
  
    consoleErrorSpy.mockRestore();
  });
  
});
