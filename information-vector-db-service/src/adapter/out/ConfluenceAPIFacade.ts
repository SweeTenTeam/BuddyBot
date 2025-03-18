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
            apiToken: process.env.ATLASSIAN_API_KEY || 'your_api_key',
          },
        },
    });
  }
  
  async fetchDocuments(): Promise<Models.ContentArray<Models.Content>>{
    const documents = (await this.confluence.content.getContent({expand: ['space','history.ownedBy','body.storage'], })); //history.ownedBy
    return documents;
  }

  async fetchLastUpdatedDocuments(): Promise<Models.SearchPageResponseSearchResult>{
    const documents = await this.confluence.search.searchByCQL({cql:'lastModified >= now("-100d") or created >= now("-100d")',expand: ['space','history.ownedBy','body.storage']});
    return documents;
  }
}

//const confluenceAPI = new ConfluenceAPIFacade();
//async function ziomela(): Promise<void> {
// console.log(((await confluenceAPI.fetchLastUpdatedDocuments()).results[0].content));
//}
//ziomela();
