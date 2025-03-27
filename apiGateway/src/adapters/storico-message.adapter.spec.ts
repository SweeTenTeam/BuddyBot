import { StoricoMessageAdapter } from './storico-message.adapter';
import { RabbitMQService } from '../infrastructure/rabbitmq/rabbitmq.service';

describe('StoricoMessageAdapter', () => {
  let storicoAdapter: StoricoMessageAdapter;
  let rabbitMQService: RabbitMQService;

  beforeEach(() => {
    rabbitMQService = {
      sendToQueue: jest.fn().mockResolvedValue([
        {
          id: 'mock-id',
          question: { content: 'Ciao', timestamp: new Date().toISOString() },
          answer: { content: 'Risposta', timestamp: new Date().toISOString() },
        },
      ]),
    } as any;

    storicoAdapter = new StoricoMessageAdapter(rabbitMQService);
  });

  it('should send a message to storico_queue and return chat history', async () => {
    const result = await storicoAdapter.getStorico({ id: 'user123', numChat: 1 });

    expect(rabbitMQService.sendToQueue).toHaveBeenCalledWith(
        'storico_queue',
        expect.arrayContaining([
          expect.objectContaining({
            id: 'user123',
            question: expect.any(Object),
            answer: expect.any(Object),
          }),
        ])
      );
      

    expect(result).toEqual([
      {
        id: 'mock-id',
        question: { content: 'Ciao', timestamp: expect.any(String) },
        answer: { content: 'Risposta', timestamp: expect.any(String) },
      },
    ]);
  });
});
