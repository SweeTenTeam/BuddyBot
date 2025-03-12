import { JiraCmd } from "../../../domain/JiraCmd";

export interface JiraUseCase {
  fetchAndStoreJiraInfo(req: JiraCmd): Promise<boolean>;
}
