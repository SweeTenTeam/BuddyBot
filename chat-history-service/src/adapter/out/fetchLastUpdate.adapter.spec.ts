import { fetchLastUpdateAdapter } from './fetchLastUpdate.adapter';
import { ChatRepository } from './persistence/chat.repository';
import { LastUpdateEntity } from './persistence/lastFetch-entity';
import { LastUpdate } from 'src/domain/lastUpdate';

describe('fetchLastUpdateAdapter', () => {
  let adapter: fetchLastUpdateAdapter;
  let mockRepo: jest.Mocked<ChatRepository>;

  beforeEach(() => {
    mockRepo = {
      fetchLastUpdate: jest.fn(),
    } as any;

    adapter = new fetchLastUpdateAdapter(mockRepo);
  });

  it('should fetch the last update from repository and return a LastUpdate domain object', async () => {
    //arrange
    const mockDate = new Date('2025-04-03T12:00:00Z');
    const mockEntity: LastUpdateEntity = {
      id: 1,
      lastFetch: mockDate,
    };

    mockRepo.fetchLastUpdate.mockResolvedValue(mockEntity);

    //act
    const result = await adapter.fetchLastUpdate();

    //assert
    expect(mockRepo.fetchLastUpdate).toHaveBeenCalled();
    expect(result).toBeInstanceOf(LastUpdate);
    expect(result.lastFetch).toEqual(mockDate.toISOString());
  });
});
