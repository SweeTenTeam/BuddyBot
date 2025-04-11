import { Test, TestingModule } from '@nestjs/testing';
import { InsertLastUpdateController } from 'src/adapter/in/insertLastUpdate.controller';
import { InsertLastUpdateService } from 'src/application/insertLastUpdate.service';
import { InsertLastUpdateAdapter } from 'src/adapter/out/insertLastUpdate.adapter';
import { ChatRepository } from 'src/adapter/out/persistence/chat.repository';
import { LastUpdateDTO } from 'src/adapter/in/dto/LastUpdateDTO';
import { IU_USE_CASE } from 'src/application/port/in/insertLastUpdate-usecase.port';
import { IU_PORT_OUT } from 'src/application/port/out/insertLastUpdate.port';

describe('InsertLastUpdate Integration (Controller → Service → Adapter → RepoMock)', () => {
  let controller: InsertLastUpdateController;
  let mockChatRepo: jest.Mocked<ChatRepository>;

  beforeEach(async () => {
    mockChatRepo = {
      insertLastRetrieval: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsertLastUpdateController],
      providers: [
        InsertLastUpdateService,
        InsertLastUpdateAdapter,
        {
          provide: IU_USE_CASE,
          useExisting: InsertLastUpdateService,
        },
        {
          provide: IU_PORT_OUT,
          useExisting: InsertLastUpdateAdapter,
        },
        {
          provide: ChatRepository,
          useValue: mockChatRepo,
        },
      ],
    }).compile();

    controller = module.get<InsertLastUpdateController>(InsertLastUpdateController);
  });

  it('should insert last fetch date and return true', async () => {
    //arrange
    const mockLastFetch = '2025-04-03T12:00:00Z';
    const inputDTO: LastUpdateDTO = {
      LastFetch: mockLastFetch,
    };

    mockChatRepo.insertLastRetrieval.mockResolvedValue(true);

    //act
    const result = await controller.insertLastRetrieval(inputDTO);

    //assert
    expect(mockChatRepo.insertLastRetrieval).toHaveBeenCalledWith(mockLastFetch);
    expect(result).toBe(true);
  });
});
