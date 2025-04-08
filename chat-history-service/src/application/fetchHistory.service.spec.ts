import { FetchHistoryService } from './fetchHistory.service';
import { FetchHistoryPort } from './port/out/fetchHistory.port';
import { FetchHistoryCmd } from 'src/domain/fetchHistoryCmd';
import { Chat } from 'src/domain/chat';
import { Message } from 'src/domain/message';

describe('FetchHistoryService', () => {
  let service: FetchHistoryService;
  let mockAdapter: jest.Mocked<FetchHistoryPort>;

  beforeEach(() => {
    mockAdapter = {
      fetchStoricoChat: jest.fn(),
    };
    service = new FetchHistoryService(mockAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call FetchHistoryAdapter.fetchStoricoChat with correct parameters and return result', async () => {
    //arrange
    const cmd: FetchHistoryCmd = {
      id: 'abc1',
      numChat: 2,
    };

    const mockResult: Chat[] = [
      new Chat(
        'abc1',
        new Message('Quest 1', new Date('2025-01-01T10:00:00Z').toISOString()),
        new Message('Answer 1', new Date('2025-01-01T10:01:00Z').toISOString()),
        new Date('2025-01-01T10:05:00Z').toISOString() 
      ),
      new Chat(
        'abc2',
        new Message('Quest 2', new Date('2025-01-02T10:00:00Z').toISOString()),
        new Message('Answer 2', new Date('2025-01-02T10:01:00Z').toISOString()),
        new Date('2025-01-02T10:05:00Z').toISOString()
      ),
    ];

    mockAdapter.fetchStoricoChat.mockResolvedValue(mockResult);

    //act
    const result = await service.fetchStoricoChat(cmd);

    //assert
    expect(mockAdapter.fetchStoricoChat).toHaveBeenCalledWith(cmd);
    expect(result).toEqual(mockResult);
  });
});
