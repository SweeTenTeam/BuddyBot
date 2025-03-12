import { Injectable } from '@nestjs/common';
import { AgileClient, AgileModels } from 'jira.js';

@Injectable()
export class JiraAPIFacade {
  private jira: AgileClient;
  constructor() {
    this.jira = new AgileClient({
      host: 'https://sweetenteam.atlassian.net',
      authentication: {
        basic: {
          username: process.env.JIRA_EMAIL || 'sweetenteam@gmail.com',
          password:
            process.env.JIRA_API_KEY ||
            'ATATT3xFfGF0EobdF57le9ynA1sfmSvdzhThDRSeoCY6LWTyBF3bYzv58L22MA-rHFZy8hhgNlSfnEErGH0mIQXIGuRQMqfL-kUF3D7eYoOd9UOANKUpy2qqpNIZMDMs6zbAvryiyr8nWvqXtzxxW5Kv2BHBRH2Q3DqmDpLC8QXI1hu0XcNEc3A=A8A82B82',
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
