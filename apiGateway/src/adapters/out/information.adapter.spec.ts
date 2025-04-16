import { InformationAdapter } from './information.adapter';
import { InformationService } from '../../infrastructure/rabbitmq/information.service';
import { FetchJiraCMD } from '../../domain/cmds/FetchJiraCMD';
import { FetchConfluenceCMD } from '../../domain/cmds/FetchConfluenceCMD';
import { FetchGithubCMD } from '../../domain/cmds/FetchGithubCMD';

describe('InformationAdapter', () => {
  let adapter: InformationAdapter;
  let mockInformationService: jest.Mocked<InformationService>;

  beforeEach(() => {
    mockInformationService = {
      sendMessage: jest.fn(),
    } as any;

    adapter = new InformationAdapter(mockInformationService);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('fetchUpdateGithub', () => {
    it('should call sendMessage with "fetchAndStoreGithub" and return the result', async () => {
      const req = new FetchGithubCMD([], new Date());
      mockInformationService.sendMessage.mockResolvedValue(true);

      const result = await adapter.fetchUpdateGithub(req);

      expect(mockInformationService.sendMessage).toHaveBeenCalledWith('fetchAndStoreGithub', req);
      expect(result).toBe(true);
    });
  });

  describe('fetchUpdateJira', () => {
    it('should call sendMessage with "fetchAndStoreJira" and return the result', async () => {
      const req = new FetchJiraCMD(1, new Date());
      mockInformationService.sendMessage.mockResolvedValue(true);

      const result = await adapter.fetchUpdateJira(req);

      expect(mockInformationService.sendMessage).toHaveBeenCalledWith('fetchAndStoreJira', req);
      expect(result).toBe(true);
    });
  });

  describe('fetchUpdateConf', () => {
    it('should call sendMessage with "fetchAndStoreConfluence" and return the result', async () => {
      const req = new FetchConfluenceCMD(new Date());
      mockInformationService.sendMessage.mockResolvedValue(true);

      const result = await adapter.fetchUpdateConf(req);

      expect(mockInformationService.sendMessage).toHaveBeenCalledWith('fetchAndStoreConfluence', req);
      expect(result).toBe(true);
    });
  });
});
