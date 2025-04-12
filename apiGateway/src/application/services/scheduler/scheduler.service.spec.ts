import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './scheduler.service';
import { InfoPort } from '../../ports/out/information.port';
import { StoricoPort } from '../../ports/out/storico.port';
import { LastUpdateCMD } from '../../../domain/cmds/LastUpdateCMD';

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
      getLastUpdate: jest.fn(),
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

  //describe('onModuleInit', () => {
  //  it('should call runFetch after sleep', async () => {
  //    jest.useFakeTimers();
  //    const runFetchSpy = jest.spyOn<any, any>(service, 'runFetch').mockResolvedValue(undefined);
//
  //    const promise = service.onModuleInit();
  //    jest.advanceTimersByTime(10000);
  //    await promise;
//
  //    expect(runFetchSpy).toHaveBeenCalled();
  //    jest.useRealTimers();
  //  });
  //});

  describe('runFetch', () => {
    it('should fetch data using fallback if no LastFetch exists', async () => {
      storicoPortMock.getLastUpdate.mockResolvedValue({ LastFetch: '' });
      infoPortMock.fetchUpdateJira.mockResolvedValue(true);
      infoPortMock.fetchUpdateConf.mockResolvedValue(true);
      infoPortMock.fetchUpdateGithub.mockResolvedValue(true);
      storicoPortMock.postUpdate.mockResolvedValue(true);

      await (service as any).runFetch();

      expect(infoPortMock.fetchUpdateJira).toHaveBeenCalled();
      expect(storicoPortMock.postUpdate).toHaveBeenCalledWith(expect.any(LastUpdateCMD));
    });

    it('should fetch data using existing LastFetch if present', async () => {
      const lastDate = new Date().toISOString();
      storicoPortMock.getLastUpdate.mockResolvedValue({ LastFetch: lastDate });
      infoPortMock.fetchUpdateJira.mockResolvedValue(true);
      infoPortMock.fetchUpdateConf.mockResolvedValue(true);
      infoPortMock.fetchUpdateGithub.mockResolvedValue(true);
      storicoPortMock.postUpdate.mockResolvedValue(true);

      await (service as any).runFetch();

      expect(infoPortMock.fetchUpdateJira).toHaveBeenCalled();
      expect(storicoPortMock.postUpdate).toHaveBeenCalledWith(expect.any(LastUpdateCMD));
    });

    it('should log error if any fetch fails', async () => {
      storicoPortMock.getLastUpdate.mockResolvedValue({ LastFetch: new Date().toISOString() });
      infoPortMock.fetchUpdateJira.mockResolvedValue(false); // simulate failure
      infoPortMock.fetchUpdateConf.mockResolvedValue(true);
      infoPortMock.fetchUpdateGithub.mockResolvedValue(true);

      const loggerErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      await (service as any).runFetch();

      expect(storicoPortMock.postUpdate).not.toHaveBeenCalled();
      loggerErrorSpy.mockRestore();
    });

    it('should handle exceptions gracefully', async () => {
      storicoPortMock.getLastUpdate.mockRejectedValue(new Error('fetch error'));

      const loggerErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      await (service as any).runFetch();

      expect(infoPortMock.fetchUpdateJira).not.toHaveBeenCalled();
      loggerErrorSpy.mockRestore();
    });
  });
});
