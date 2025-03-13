import { JiraCmd } from '../../../domain/JiraCmd.js';

export interface JiraUseCase {
  fetchAndStoreJiraInfo(req: JiraCmd): Promise<boolean>;
}
