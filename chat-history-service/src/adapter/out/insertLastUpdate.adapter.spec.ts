import { InsertLastUpdateAdapter } from './insertLastUpdate.adapter';
import { ChatRepository } from './persistence/chat.repository';
import { LastUpdateCmd } from 'src/domain/lastUpdateCmd';

describe('InsertLastUpdateAdapter', () => {
  let adapter: InsertLastUpdateAdapter;
  let mockRepo: jest.Mocked<ChatRepository>;

  beforeEach(() => {
    mockRepo = {
      insertLastRetrieval: jest.fn(),
    } as any;
    adapter = new InsertLastUpdateAdapter(mockRepo);
  });

  it('should call ChatRepository.insertLastRetrieval with correct date and return true', async () => {
    //arrange
    const mockCmd: LastUpdateCmd = {
      LastFetch: '2025-04-03T12:00:00Z',
    };

    mockRepo.insertLastRetrieval.mockResolvedValue(true);

    //act
    const result = await adapter.insertLastRetrieval(mockCmd);

    //assert
    expect(mockRepo.insertLastRetrieval).toHaveBeenCalledWith(mockCmd.LastFetch);
    expect(result).toBe(true);
  });
});
