import { Test, TestingModule } from '@nestjs/testing';
import * as amqp from 'amqplib';
import { RabbitMQService } from './rabbitmq.service';

jest.mock('amqplib'); // Mock amqplib

describe('RabbitMQService', () => {
  let service: RabbitMQService;
  let mockChannel: any;
  let mockConnection: any;

  beforeEach(async () => {
    mockChannel = {
      assertQueue: jest.fn().mockImplementation((queueName) => {
        if (['chatbot_queue', 'storico_queue', 'storico_save_queue'].includes(queueName)) {
          return Promise.resolve();
        }
        if (queueName === '') {
          return Promise.resolve({ queue: 'temp_reply_queue' });
        }
        return Promise.reject(new Error('Queue not mocked'));
      }),
      sendToQueue: jest.fn(),
      consume: jest.fn(),
      ack: jest.fn(),
      close: jest.fn(),
      cancel: jest.fn(), // 
    };

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn(),
    };

    (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitMQService,
        {
          provide: 'RABBITMQ_CLIENT',
          useValue: mockConnection,
        },
      ],
    }).compile();

    service = module.get<RabbitMQService>(RabbitMQService);
    await service.onModuleInit(); // init sim
  });

  afterEach(async () => {
    await service.closeConnection();
  });

  
  it('dovrebbe inizializzare il servizio e creare le code', async () => {
    expect(mockChannel.assertQueue).toHaveBeenCalledWith('chatbot_queue');
    expect(mockChannel.assertQueue).toHaveBeenCalledWith('storico_queue');
    expect(mockChannel.assertQueue).toHaveBeenCalledWith('storico_save_queue');
  });

  
  it('dovrebbe inviare un messaggio alla coda e ricevere una risposta', async () => {
    const queue = 'test_queue';
    const data = { text: 'Hello' };

    // Mock risposta temporanea
    mockChannel.consume.mockImplementation((q, cb) => {
      if (q === 'temp_reply_queue') {
        setTimeout(() => {
          cb({
            content: Buffer.from(JSON.stringify({ response: 'OK' })),
            properties: { correlationId: '123' },
          });
        }, 100);
      }
    });

    const response = await service.sendToQueue<typeof data, { response: string }>(queue, data);
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      queue,
      Buffer.from(JSON.stringify(data)),
      expect.objectContaining({
        replyTo: 'temp_reply_queue',
        correlationId: expect.any(String),
      })
    );
    expect(response).toEqual({ response: 'OK' });
  });

  
  it('dovrebbe consumare un messaggio dalla coda', async () => {
    const queue = 'test_queue';
    const callback = jest.fn();

    mockChannel.consume.mockImplementation((q, cb) => {
      setTimeout(() => {
        cb({ content: Buffer.from(JSON.stringify({ msg: 'Hello' })) });
      }, 50);
    });

    await service.consumeQueue(queue, callback);
    expect(mockChannel.consume).toHaveBeenCalledWith(queue, expect.any(Function));
    expect(callback).toHaveBeenCalledWith({ msg: 'Hello' });
  });

  
  it('dovrebbe chiudere la connessione correttamente', async () => {
    await service.closeConnection();
    expect(mockChannel.close).toHaveBeenCalled();
    expect(mockConnection.close).toHaveBeenCalled();
  });

  
  it('dovrebbe gestire il timeout quando la coda non risponde', async () => {
    const queue = 'timeout_queue';
    const data = { text: 'Prova' };

    await expect(service.sendToQueue(queue, data, 100)).rejects.toThrow('Timeout su coda: timeout_queue');
    expect(mockChannel.cancel).toHaveBeenCalled(); 
  });
});
