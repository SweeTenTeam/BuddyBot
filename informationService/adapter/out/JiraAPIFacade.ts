import JiraApi, { JsonResponse } from "jira-client";

export class JiraAPIFacade {
  private jira: JiraApi;
  constructor() {
    this.jira = new JiraApi({
      protocol: "https",
      host: "sweetenteam.atlassian.net",
      username: process.env.JIRA_EMAIL || "sweetenteam@gmail.com",
      password:
        process.env.JIRA_API_KEY ||
        "ATATT3xFfGF0EobdF57le9ynA1sfmSvdzhThDRSeoCY6LWTyBF3bYzv58L22MA-rHFZy8hhgNlSfnEErGH0mIQXIGuRQMqfL-kUF3D7eYoOd9UOANKUpy2qqpNIZMDMs6zbAvryiyr8nWvqXtzxxW5Kv2BHBRH2Q3DqmDpLC8QXI1hu0XcNEc3A=A8A82B82",
      apiVersion: "3",
      strictSSL: true,
    });
  }
  async fetchTicket(id: string): Promise<string> {
    const issue = await this.jira.findIssue(id);
    console.log(issue);
    return "1";
  }

  async fetchProjects(id: string): Promise<string> {
    const issue = await this.jira.getProjectsFull("1");
    console.log(issue);
    return "1";
  }

  async fetchProject(id: string): Promise<string> {
    const issue = await this.jira.getProject("KAN");
    console.log(issue);
    return "1";
  }

  async fetchStoryPoint(id: string): Promise<string> {
    const issue = await this.jira.getIssueEstimationForBoard("10000", 1);
    console.log(issue);
    return "1";
  }

  async fetchIssuesForBoard(
    id: string,
    lastUpdate: string,
  ): Promise<JsonResponse> {
    const boardIssues = await this.jira.getIssuesForBoard(
      id,
      0,
      50,
      `updated >= "-${lastUpdate}d"`,
    ); //importante
    //console.log(boardIssues);
    return boardIssues.issues;
  }
}
