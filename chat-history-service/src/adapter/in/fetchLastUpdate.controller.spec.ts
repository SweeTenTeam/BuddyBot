import { Test, TestingModule } from '@nestjs/testing';
import { FetchLastUpdateController } from './fetchLastUpdate.controller';
import { FetchLastUpdateService } from 'src/application/fetchLastUpdate.service';
import { FU_USE_CASE } from 'src/application/port/in/fetchLastUpdate-usecase';
import { LastUpdate } from 'src/domain/lastUpdate';
import { LastUpdateDTO } from './dto/LastUpdateDTO';

describe('FetchLastUpdateController', () => {
  let controller: FetchLastUpdateController;
  let mockService: jest.Mocked<FetchLastUpdateService>;

  beforeEach(async () => {
    mockService = {
      fetchLastUpdate: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchLastUpdateController],
      providers: [
        {
          provide: FU_USE_CASE,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<FetchLastUpdateController>(FetchLastUpdateController);
  });

  it('should return a LastUpdateDTO with the correct lastFetch value', async () => {
    //arrange
    const mockLastFetch = '2025-04-08T12:00:00Z';
    mockService.fetchLastUpdate.mockResolvedValue(new LastUpdate(mockLastFetch));

    //act
    const result = await controller.fetchLastUpdate();

    //assert
    expect(mockService.fetchLastUpdate).toHaveBeenCalled();
    expect(result).toBeInstanceOf(LastUpdateDTO);
    expect(result.LastFetch).toEqual(mockLastFetch);
  });
});
