import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQService } from './rabbitmq.service';
import * as amqp from 'amqplib';

jest.mock('amqplib'); // Mock amqplib !!!

describe('RabbitMQService', () => {
  let rabbitMQService: RabbitMQService;
  let channelMock: any;
  let connectionMock: any;

  beforeEach(async () => {
    jest.useFakeTimers(); // !!!
  
    channelMock = {
        assertQueue: jest.fn().mockResolvedValue({}),
        sendToQueue: jest.fn(),
        close: jest.fn(),
        consume: jest.fn().mockImplementation((queue, callback) => {
            setTimeout(() => {
              const message = {
                content: Buffer.from(JSON.stringify({ success: true })), 
              };
              console.log(`📥 Mock: ricevuto messaggio su ${queue}:`, message); // 🔍 Debug
              callback(message); 
              channelMock.ack?.(message); 
            }, 100);
          }),          
        ack: jest.fn(), //  Mock ack !!!
      };
      
      
  
    connectionMock = {
      createChannel: jest.fn().mockResolvedValue(channelMock),
      close: jest.fn(),
    };
  
    (amqp.connect as jest.Mock).mockResolvedValue(connectionMock);
  
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitMQService,
        { provide: 'RABBITMQ_CLIENT', useValue: connectionMock },
      ],
    }).compile();
  
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
    await rabbitMQService.initialize();
  });
  
  
  afterEach(async () => {
    jest.clearAllMocks();
    await rabbitMQService.closeConnection(); // close connessione mockata
  });

  it('should connect to RabbitMQ', async () => {
    expect(connectionMock.createChannel).toHaveBeenCalled();
    expect(channelMock.assertQueue).toHaveBeenCalledWith('chatbot_queue');
    expect(channelMock.assertQueue).toHaveBeenCalledWith('storico_queue');
    expect(channelMock.assertQueue).toHaveBeenCalledWith('storico_save_queue');
  });
  // !!!
  /*
  it('should send a message to a queue', async () => {
    //jest.setTimeout(20000); //  timeout a 20 secondi
  
    await rabbitMQService.sendToQueue('chatbot_queue', { message: 'Ciao' });
  
    expect(channelMock.sendToQueue).toHaveBeenCalledWith(
      'chatbot_queue',
      expect.any(Buffer),
      expect.any(Object),
    );
  });*/
  
  it('should consume a message from a queue', async () => {
    const callback = jest.fn();
    await rabbitMQService.consumeQueue('chatbot_queue', callback);
  
    expect(channelMock.consume).toHaveBeenCalledWith(
      'chatbot_queue',
      expect.any(Function),
    );
  });
  

  it('should handle errors when sending a message', async () => {
    channelMock.sendToQueue.mockImplementation(() => {
      throw new Error('Send error');
    });

    await expect(rabbitMQService.sendToQueue('chatbot_queue', { message: 'Errore' }))
      .rejects
      .toThrow('Send error');
  });

  it('should close RabbitMQ connection', async () => {
    await rabbitMQService.closeConnection();

    expect(channelMock.close).toHaveBeenCalled();
    expect(connectionMock.close).toHaveBeenCalled();
  });
});
