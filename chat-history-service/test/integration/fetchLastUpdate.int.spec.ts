import { Test, TestingModule } from '@nestjs/testing';
import { FetchLastUpdateController } from 'src/adapter/in/fetchLastUpdate.controller';
import { FetchLastUpdateService } from 'src/application/fetchLastUpdate.service';
import { fetchLastUpdateAdapter } from 'src/adapter/out/fetchLastUpdate.adapter';
import { ChatRepository } from 'src/adapter/out/persistence/chat.repository';
import { FU_USE_CASE } from 'src/application/port/in/fetchLastUpdate-usecase';
import { FU_PORT_OUT } from 'src/application/port/out/fetchLastUpdate.port';
import { LastUpdateDTO } from 'src/adapter/in/dto/LastUpdateDTO';

describe('FetchLastUpdate Integration (Controller → Service → Adapter → RepoMock)', () => {
  let controller: FetchLastUpdateController;
  let mockChatRepo: jest.Mocked<ChatRepository>;

  beforeEach(async () => {
    mockChatRepo = {
      fetchLastUpdate: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchLastUpdateController],
      providers: [
        FetchLastUpdateService,
        fetchLastUpdateAdapter,
        {
          provide: FU_USE_CASE,
          useExisting: FetchLastUpdateService,
        },
        {
          provide: FU_PORT_OUT,
          useExisting: fetchLastUpdateAdapter,
        },
        {
          provide: ChatRepository,
          useValue: mockChatRepo,
        },
      ],
    }).compile();

    controller = module.get<FetchLastUpdateController>(FetchLastUpdateController);
  });

  it('should fetch last update and return LastUpdateDTO', async () => {
    //arrange
    const mockDate = new Date('2025-04-03T10:00:00Z');

    mockChatRepo.fetchLastUpdate.mockResolvedValue({
      id: 1,
      lastFetch: mockDate,
    });

    //act
    const result = await controller.fetchLastUpdate();

    //assert
    expect(mockChatRepo.fetchLastUpdate).toHaveBeenCalled();
    expect(result).toBeInstanceOf(LastUpdateDTO);
    expect(result.LastFetch).toEqual(mockDate.toISOString());
  });
});
