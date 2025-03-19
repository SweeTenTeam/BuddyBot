import { JiraCmd } from '../../../domain/command/JiraCmd.js';

export interface JiraUseCase {
  fetchAndStoreJiraInfo(req: JiraCmd): Promise<boolean>;
}

export const JIRA_USECASE = Symbol('JIRA_USECASE');