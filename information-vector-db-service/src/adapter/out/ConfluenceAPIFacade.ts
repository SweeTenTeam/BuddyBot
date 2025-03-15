import { Injectable } from '@nestjs/common';
import { ConfluenceClient, Models } from 'confluence.js';

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
    const spaceContents = await this.confluence.space.getContentForSpace({spaceKey: '~712020a978bfb8df77494da2183efc1d3da02e'});
    console.log(spaceContents);
  }

  async fetchDocuments(): Promise<Models.ContentArray<Models.Content>>{
    const documents = (await this.confluence.content.getContent({expand: ['space','history.ownedBy','body.storage']})); //history.ownedBy
    return documents;
  }

  async fetchLastUpdatedDocuments(): Promise<Models.SearchPageResponseSearchResult>{
    const documents = await this.confluence.search.searchByCQL({cql:'lastModified >= now("-100d") or created >= now("-100d")'});
    return documents
  }
}

//const confluenceAPI = new ConfluenceAPIFacade();
//async function ziomela(): Promise<void> {
// console.log(((await confluenceAPI.fetchLastUpdatedDocuments()).results[0].content));
//}
//ziomela();
