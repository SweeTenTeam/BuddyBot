import { JiraCmd } from '../../../domain/command/JiraCmd.js';
import { Result } from '../../../domain/business/Result.js';

export interface JiraUseCase {
  fetchAndStoreJiraInfo(req: JiraCmd): Promise<Result>;
}

export const JIRA_USECASE = Symbol('JIRA_USECASE');