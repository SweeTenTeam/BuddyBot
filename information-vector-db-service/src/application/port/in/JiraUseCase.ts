import { JiraCmd } from '../../../domain/JiraCmd.js';

export interface JiraUseCase {
  fetchAndStoreJiraInfo(req: JiraCmd): Promise<boolean>;
}

export const JIRA_USECASE = Symbol('JIRA_USECASE');