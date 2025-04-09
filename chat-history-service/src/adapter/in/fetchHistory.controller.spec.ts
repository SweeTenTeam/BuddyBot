import { Test, TestingModule } from '@nestjs/testing';
import { FetchHistoryController } from './fetchHistory.controller';
import { FetchHistoryUseCase } from 'src/application/port/in/fetchHistory-usecase.port';
import { FH_USE_CASE } from 'src/application/port/in/fetchHistory-usecase.port';
import { Chat } from 'src/domain/chat';
import { Message } from 'src/domain/message';
import { FetchRequestDTO } from './dto/FetchRequestDTO';

describe('FetchHistoryController', () => {
  let controller: FetchHistoryController;
  let mockFetchHistoryService: jest.Mocked<FetchHistoryUseCase>;

  beforeEach(async () => {
    mockFetchHistoryService = {
      fetchStoricoChat: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchHistoryController],
      providers: [
        {
          provide: FH_USE_CASE,
          useValue: mockFetchHistoryService,
        },
      ],
    }).compile();

    controller = module.get<FetchHistoryController>(FetchHistoryController);
  });

  it('should fetch chat history and return ChatDTO[]', async () => {
    //arrange
    const input: FetchRequestDTO = {
      id: 'chatabc',
      numChat: 2,
    };

    const mockChats: Chat[] = [
      new Chat(
        'chatabc',
        new Message('Quest 1', '2025-04-01T10:00:00Z'),
        new Message('Answer 1', '2025-04-01T10:01:00Z'),
        '2025-04-01T09:55:00Z'
      ),
      new Chat(
        'chatabd',
        new Message('Quest 2', '2025-04-01T11:00:00Z'),
        new Message('Answer 2', '2025-04-01T11:01:00Z'),
        '2025-04-01T10:55:00Z'
      ),
    ];

    mockFetchHistoryService.fetchStoricoChat.mockResolvedValue(mockChats);

    //act
    const result = await controller.fetchChatHistory(input);

    //assert
    expect(mockFetchHistoryService.fetchStoricoChat).toHaveBeenCalledWith({
      id: input.id,
      numChat: input.numChat,
    });

    expect(result).toMatchObject([
      {
        id: 'chatabc',
        question: {
          content: 'Quest 1',
          timestamp: '2025-04-01T10:00:00Z',
        },
        answer: {
          content: 'Answer 1',
          timestamp: '2025-04-01T10:01:00Z',
        },
        lastFetch: '2025-04-01T09:55:00Z',
      },
      {
        id: 'chatabd',
        question: {
          content: 'Quest 2',
          timestamp: '2025-04-01T11:00:00Z',
        },
        answer: {
          content: 'Answer 2',
          timestamp: '2025-04-01T11:01:00Z',
        },
        lastFetch: '2025-04-01T10:55:00Z',
      },
    ]);
  });
});
