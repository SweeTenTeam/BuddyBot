import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './scheduler.service';
import { InfoPort } from '../../ports/out/information.port';
import { StoricoPort } from '../../ports/out/storico.port';

describe('TasksService', () => {
  let service: TasksService;
  let infoPortMock: jest.Mocked<InfoPort>;
  let storicoPortMock: jest.Mocked<StoricoPort>;

  beforeEach(async () => {
    infoPortMock = {
      fetchUpdateJira: jest.fn(),
      fetchUpdateConf: jest.fn(),
      fetchUpdateGithub: jest.fn(),
    } as any;

    storicoPortMock = {
      postUpdate: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: 'InfoPort', useValue: infoPortMock },
        { provide: 'StoricoPort', useValue: storicoPortMock },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleCron', () => {
    it('should call fetch methods and save the update when all succeed', async () => {
      infoPortMock.fetchUpdateJira.mockResolvedValue(true);
      infoPortMock.fetchUpdateConf.mockResolvedValue(true);
      infoPortMock.fetchUpdateGithub.mockResolvedValue(true);
      storicoPortMock.postUpdate.mockResolvedValue(true);

      await service.handleCron();

      expect(infoPortMock.fetchUpdateJira).toHaveBeenCalled();
      expect(infoPortMock.fetchUpdateConf).toHaveBeenCalled();
      expect(infoPortMock.fetchUpdateGithub).toHaveBeenCalled();
      expect(storicoPortMock.postUpdate).toHaveBeenCalled();
    });

    it('should not save the update if one of the fetches fails', async () => {
      infoPortMock.fetchUpdateJira.mockResolvedValue(true);
      infoPortMock.fetchUpdateConf.mockResolvedValue(false); // one fails
      infoPortMock.fetchUpdateGithub.mockResolvedValue(true);

      await service.handleCron();

      expect(storicoPortMock.postUpdate).not.toHaveBeenCalled();
    });
  });
});
