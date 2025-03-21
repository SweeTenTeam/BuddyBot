import { Injectable } from '@nestjs/common';
import { AgileClient, AgileModels } from 'jira.js';

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
}

//const githubAPI = new JiraAPIFacade();
//async function ziomela(): Promise<void> {
// console.log(await githubAPI.fetchIssuesForBoard(1));
//}
//ziomela();