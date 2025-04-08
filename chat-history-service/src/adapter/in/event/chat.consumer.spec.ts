import { Test, TestingModule } from '@nestjs/testing';
import { ChatConsumer } from './chat.consumer';
import { IC_USE_CASE } from 'src/application/port/in/insertChat-usecase.port';
import { InsertChatUseCase } from 'src/application/port/in/insertChat-usecase.port';
import { CreateChatDTO } from '../dto/CreateChatDTO';
import { ChatDTO } from '../dto/ChatDTO';

describe('ChatConsumer', () => {
  let controller: ChatConsumer;
  let mockService: jest.Mocked<InsertChatUseCase>;

  beforeEach(async () => {
    mockService = {
      insertChat: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatConsumer],
      providers: [
        {
          provide: IC_USE_CASE,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ChatConsumer>(ChatConsumer);
  });

  it('should handle a CreateChatDTO and return a ChatDTO', async () => {
    //arrange
    const question = 'Domanda di test?';
    const timestamp = '2025-04-07T14:00:00Z';
    const answer = 'Risposta di test!';
    const createChatDto = new CreateChatDTO(question, timestamp, answer);

    const expectedChatDto: ChatDTO = {
      id: 'chatabc',
      question: {
        content: question,
        timestamp: timestamp,
      },
      answer: {
        content: answer,
        timestamp: '2025-04-07T14:00:01Z',
      },
      lastFetch: '2025-04-07T13:55:00Z',
    };

    mockService.insertChat.mockResolvedValue(expectedChatDto);

    //act
    const result = await controller.handleMessage(createChatDto);

    //assert
    expect(mockService.insertChat).toHaveBeenCalledWith({
      question: { content: question, timestamp },
      answer: { content: answer },
    });

    expect(result).toEqual(expectedChatDto);
  });
});
