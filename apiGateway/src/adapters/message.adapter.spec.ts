import { MessageAdapter } from './message.adapter';
import { RabbitMQService } from '../infrastructure/rabbitmq/rabbitmq.service';

describe('MessageAdapter', () => {
  let messageAdapter: MessageAdapter;
  let rabbitMQService: RabbitMQService;

  beforeEach(() => {
    rabbitMQService = {
      sendToQueue: jest.fn().mockResolvedValue({
        question: 'Ciao',
        answer: 'Risposta dal mock',
        timestamp: new Date().toISOString(),
      }),
    } as any;

    messageAdapter = new MessageAdapter(rabbitMQService);
  });

  it('should send a message to chatbot_queue and return a response', async () => {
    const result = await messageAdapter.getRisposta({ text: 'Ciao', date: new Date().toISOString() });

    expect(rabbitMQService.sendToQueue).toHaveBeenCalledWith('chatbot_queue', {
      question: 'Ciao',
      answer: '',
      timestamp: expect.any(String),
    });

    expect(result).toEqual({
      question: 'Ciao',
      answer: 'Risposta dal mock',
      timestamp: expect.any(String),
    });
  });

  // !!!
  it('should throw an error if RabbitMQ fails', async () => {
    rabbitMQService.sendToQueue = jest.fn().mockRejectedValue(new Error('RabbitMQ failure'));
  
    await expect(messageAdapter.getRisposta({ text: 'Ciao', date: new Date().toISOString() }))
      .rejects
      .toThrow('RabbitMQ failure');
  });

  it('should throw an error if text is empty', async () => {
    await expect(messageAdapter.getRisposta({ text: '', date: new Date().toISOString() }))
      .rejects
      .toThrow("Il testo della domanda non può essere vuoto");
  });
  
  it('should assign a timestamp if date is not provided', async () => {
    const result = await messageAdapter.getRisposta({ text: 'Ciao', date:'' });
  
    expect(result.timestamp).toBeDefined();
    expect(typeof result.timestamp).toBe('string');
  });
  
  it('should throw an error if RabbitMQ returns null', async () => {
    rabbitMQService.sendToQueue = jest.fn().mockResolvedValue(null);
  
    await expect(messageAdapter.getRisposta({ text: 'Ciao', date: new Date().toISOString() }))
      .rejects
      .toThrow("Risposta non valida da RabbitMQ");
  });
  
  
});
