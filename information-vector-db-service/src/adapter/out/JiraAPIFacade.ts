import { Injectable } from '@nestjs/common';
import { AgileClient, AgileModels, Version3Client, Version3Models } from 'jira.js';

//@Injectable()
export class JiraAPIFacade {
  private jira: AgileClient;
  constructor() {
    this.jira = new AgileClient({
      host: 'https://sweetenteam.atlassian.net',
      authentication: {
        basic: {
          username: process.env.JIRA_EMAIL || 'sweetenteam@gmail.com',
          password:
            process.env.ATLASSIAN_API_KEY || 'your_api_key',
        },
      },
    });
  }

  async fetchIssuesForBoard(
    boardId: number,
  ): Promise<AgileModels.SearchResults> {
    return await this.jira.board.getIssuesForBoard({ boardId: boardId });
  }

  async fetchRecentIssues(boardId: number, daysBack: number): Promise<Version3Models.Issue[]> {
    let jiraClientV3 = new Version3Client({
      host: 'https://sweetenteam.atlassian.net',
      authentication: {
        basic: {
          username: process.env.JIRA_EMAIL || 'sweetenteam@gmail.com',
          password: process.env.ATLASSIAN_API_KEY || 'your_api_key',
        },
      },
    });

    let jqlQuery = `(created >= -${daysBack}d OR updated >= -${daysBack}d)`;
    let allResults: Version3Models.Issue[] = [];
    let nextPageToken: string | undefined;

    while (true) {
      const searchParams = {
        expand: "names",
        jql: jqlQuery,
        fields: ["*all"],
        ...(nextPageToken && { nextPageToken })
      };

      const response = await jiraClientV3.issueSearch.searchForIssuesUsingJqlEnhancedSearch(searchParams);
      if (response.issues) {
        allResults = allResults.concat(response.issues);
      }

      if (!response.nextPageToken) {
        break;
      }
      nextPageToken = response.nextPageToken;
    }

    return allResults;
  }
}
