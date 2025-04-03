import { InsertLastUpdateService } from './insertLastUpdate.service';
import { InsertLastUpdatePort } from './port/out/insertLastUpdate.port';
import { LastUpdateCmd } from 'src/domain/lastUpdateCmd';

describe('InsertLastUpdateService', () => {
  let service: InsertLastUpdateService;
  let mockAdapter: jest.Mocked<InsertLastUpdatePort>;

  beforeEach(() => {
    mockAdapter = {
      insertLastRetrieval: jest.fn(),
    };
    service = new InsertLastUpdateService(mockAdapter);
  });

  it('should call InsertLastUpdateAdapter.insertLastRetrieval with the correct data and return true', async () => {
    // arrange
    const mockCmd: LastUpdateCmd = {
      LastFetch: '2025-04-03T12:00:00Z',
    };

    mockAdapter.insertLastRetrieval.mockResolvedValue(true);

    // act
    const result = await service.insertLastRetrieval(mockCmd);

    // assert
    expect(mockAdapter.insertLastRetrieval).toHaveBeenCalledWith(mockCmd);
    expect(result).toBe(true);
  });
});
