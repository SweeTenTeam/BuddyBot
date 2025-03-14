import { JiraCmd } from '../../../domain/JiraCmd';

export interface JiraUseCase {
  fetchAndStoreJiraInfo(req: JiraCmd): Promise<boolean>;
}

export const JIRA_USECASE = Symbol('JIRA_USECASE');