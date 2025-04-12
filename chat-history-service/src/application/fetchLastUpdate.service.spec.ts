import { FetchLastUpdateService } from './fetchLastUpdate.service';
import { LastUpdate } from 'src/domain/lastUpdate';
import { FetchLastUpdatePort } from './port/out/fetchLastUpdate.port';

describe('FetchLastUpdateService', () => {
  let service: FetchLastUpdateService;
  let mockAdapter: jest.Mocked<FetchLastUpdatePort>;

  beforeEach(() => {
    mockAdapter = {
      fetchLastUpdate: jest.fn(),
    };

    service = new FetchLastUpdateService(mockAdapter);
  });

  it('should return a LastUpdate object from the adapter', async () => {
    //arrange
    const mockDate = '2025-04-03T10:00:00Z';
    const mockLastUpdate = new LastUpdate(mockDate);
    mockAdapter.fetchLastUpdate.mockResolvedValue(mockLastUpdate);

    //act
    const result = await service.fetchLastUpdate();

    //assert
    expect(mockAdapter.fetchLastUpdate).toHaveBeenCalled();
    expect(result).toBeInstanceOf(LastUpdate);
    expect(result.lastFetch).toEqual(mockDate);
  });
});
