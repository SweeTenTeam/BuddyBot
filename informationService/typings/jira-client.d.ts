import JiraApi from "jira-client";

declare module "jira-client" {
  class JiraApi{
    /**
     * Get issue estimation for board
     * @param issueIdOrKey - Id of issue
     * @param boardId - The id of the board required to determine which field
     * is used for estimation.
     */
    getIssueEstimationForBoard(
      issueIdOrKey: string,
      boardId: number,
    ): Promise<JiraApi.JsonResponse>;
  }
}
