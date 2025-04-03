import { Test, TestingModule } from '@nestjs/testing';
import { FetchHistoryController } from 'src/adapter/in/fetchHistory.controller';
import { FetchHistoryService } from 'src/application/fetchHistory.service';
import { FetchHistoryAdapter } from 'src/adapter/out/fetchHistory.adapter';
import { ChatRepository } from 'src/adapter/out/persistence/chat.repository';
import { FH_USE_CASE } from 'src/application/port/in/fetchHistory-usecase.port';
import { FH_PORT_OUT } from 'src/application/port/out/fetchHistory.port';
import { FetchRequestDTO } from 'src/adapter/in/dto/FetchRequestDTO';

describe('FetchHistory Integration (Controller → Service → Adapter → RepoMock)', () => {
  let controller: FetchHistoryController;
  let mockRepo: jest.Mocked<ChatRepository>;

  beforeEach(async () => {
    mockRepo = {
      fetchStoricoChat: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchHistoryController],
      providers: [
        FetchHistoryService,
        FetchHistoryAdapter,
        {
          provide: FH_USE_CASE,
          useExisting: FetchHistoryService,
        },
        {
          provide: FH_PORT_OUT,
          useExisting: FetchHistoryAdapter,
        },
        {
          provide: ChatRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    controller = module.get<FetchHistoryController>(FetchHistoryController);
  });

  it('should fetch chat history and return mapped ChatDTO[]', async () => {
    // arrange
    const inputDTO: FetchRequestDTO = {
      id: 'chat-abb',
      numChat: 2,
    };

    const mockChatEntities = [
      {
        id: 'chat-abc',
        question: 'Q1',
        questionDate: new Date('2025-04-01T10:00:00Z'),
        answer: 'A1',
        answerDate: new Date('2025-04-01T10:01:00Z'),
        lastFetch: '2025-04-01T10:05:00Z',
      },
      {
        id: 'chat-abd',
        question: 'Q2',
        questionDate: new Date('2025-04-01T11:00:00Z'),
        answer: 'A2',
        answerDate: new Date('2025-04-01T11:01:00Z'),
        lastFetch: '2025-04-01T11:05:00Z',
      },
    ];

    mockRepo.fetchStoricoChat.mockResolvedValue(mockChatEntities);

    // act
    const result = await controller.fetchChatHistory(inputDTO);

    // assert
    expect(mockRepo.fetchStoricoChat).toHaveBeenCalledWith(inputDTO.id, inputDTO.numChat);
    expect(result).toHaveLength(2);

    expect(result[0]).toEqual({
      id: 'chat-abc',
      question: {
        content: 'Q1',
        timestamp: mockChatEntities[0].questionDate.toISOString(),
      },
      answer: {
        content: 'A1',
        timestamp: mockChatEntities[0].answerDate.toISOString(),
      },
      lastFetch: '2025-04-01T10:05:00Z',
    });

    expect(result[1]).toEqual({
      id: 'chat-abd',
      question: {
        content: 'Q2',
        timestamp: mockChatEntities[1].questionDate.toISOString(),
      },
      answer: {
        content: 'A2',
        timestamp: mockChatEntities[1].answerDate.toISOString(),
      },
      lastFetch: '2025-04-01T11:05:00Z',
    });
  });
});
