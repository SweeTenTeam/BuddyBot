import { FetchConfluenceCMD } from '../../../domain/cmds/FetchConfluenceCMD';
import { FetchJiraCMD } from '../../../domain/cmds/FetchJiraCMD';
import { FetchGithubCMD } from '../../../domain/cmds/FetchGithubCMD';

export interface InfoPort {
  fetchUpdateGithub(req: FetchGithubCMD): Promise<Boolean>;
  fetchUpdateJira(req: FetchJiraCMD): Promise<Boolean>;
  fetchUpdateConf(req: FetchConfluenceCMD): Promise<Boolean>;
}