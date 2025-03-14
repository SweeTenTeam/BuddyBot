import { Injectable } from '@nestjs/common';
import { ConfluenceClient } from 'confluence.js';

//@Injectable()
export class ConfluenceAPIFacade {
  private confluence: ConfluenceClient;
  constructor() {
    this.confluence = new ConfluenceClient({
        host: 'https://sweetenteam.atlassian.net',
        authentication: {
          basic: {
            email: 'sweetenteam@gmail.com',
            apiToken: process.env.ATLASSIAN_KEY || 'ATATT3xFfGF0EobdF57le9ynA1sfmSvdzhThDRSeoCY6LWTyBF3bYzv58L22MA-rHFZy8hhgNlSfnEErGH0mIQXIGuRQMqfL-kUF3D7eYoOd9UOANKUpy2qqpNIZMDMs6zbAvryiyr8nWvqXtzxxW5Kv2BHBRH2Q3DqmDpLC8QXI1hu0XcNEc3A=A8A82B82',
          },
        },
    });
  }

  async fetchSpaces(): Promise<void> {
    console.log(await this.confluence.space.getSpaces());
    //return await this.jira.board.getIssuesForBoard({ boardId: boardId });
  }

  async fetchSpace(): Promise<void>{
    console.log(await this.confluence.space.getSpace({spaceKey: '~712020a978bfb8df77494da2183efc1d3da02e',expand: ['homepage']}))
  }

  async 
}

const confluenceAPI = new ConfluenceAPIFacade();
async function ziomela(): Promise<void> {
 console.log(await confluenceAPI.fetchSpace());
}
ziomela();
