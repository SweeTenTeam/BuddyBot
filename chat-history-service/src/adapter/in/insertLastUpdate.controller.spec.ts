import { Test, TestingModule } from '@nestjs/testing';
import { InsertLastUpdateController } from './insertLastUpdate.controller';
import { InsertLastUpdateService } from 'src/application/insertLastUpdate.service';
import { IU_USE_CASE } from 'src/application/port/in/insertLastUpdate-usecase.port';
import { LastUpdateDTO } from './dto/LastUpdateDTO';

describe('InsertLastUpdateController', () => {
  let controller: InsertLastUpdateController;
  let mockService: jest.Mocked<InsertLastUpdateService>;

  beforeEach(async () => {
    mockService = {
      insertLastRetrieval: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsertLastUpdateController],
      providers: [
        {
          provide: IU_USE_CASE,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<InsertLastUpdateController>(InsertLastUpdateController);
  });

  it('should insert last fetch date and return true', async () => {
    //arrange
    const dto: LastUpdateDTO = {
      LastFetch: '2025-04-07T12:00:00Z',
    };

    mockService.insertLastRetrieval.mockResolvedValue(true);

    //act
    const result = await controller.insertLastRetrieval(dto);

    //assert
    expect(mockService.insertLastRetrieval).toHaveBeenCalledWith({
      LastFetch: dto.LastFetch,
    });

    expect(result).toBe(true);
  });
});
