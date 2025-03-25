import { Injectable } from '@nestjs/common';
import { ConfluenceClient, Models } from 'confluence.js';

//@Injectable()
export class ConfluenceAPIFacade {
  // private confluence: ConfluenceClient;
  constructor() {
    // this.confluence = new ConfluenceClient({
    //     host: 'https://sweetenteam.atlassian.net',
    //     authentication: {
    //       basic: {
    //         email: 'sweetenteam@gmail.com',
    //         apiToken: process.env.ATLASSIAN_API_KEY || 'your_api_key',
    //       },
    //     },
    // });
  }
  
  // async fetchDocuments(): Promise<Models.ContentArray<Models.Content>>{
  //   const documents = (await this.confluence.content.getContent({expand: ['space','history.ownedBy','body.storage'], })); //history.ownedBy
  //   return documents;
  // }

  // async fetchLastUpdatedDocuments(): Promise<Models.SearchPageResponseSearchResult>{
  //   const documents = await this.confluence.search.searchByCQL({cql:'lastModified >= now("-100d") or created >= now("-100d")',expand: ['space','history.ownedBy','body']});
  //   return documents;
  // }

  async getConfluencePagesDirectAPI() {
    if (!process.env.ATLASSIAN_API_KEY) {
    throw new Error('ATLASSIAN_API_KEY environment variable is not set');
  }
    try {
      const response = await fetch('https://sweetenteam.atlassian.net/wiki/api/v2/pages', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from('sweetenteam@gmail.com:' + process.env.ATLASSIAN_API_KEY).toString('base64')}`,
          'Accept': 'application/json'
        }
      });
      
      console.log(`Response: ${response.status} ${response.statusText}`);
      
      const data = await response.text();
      console.log(data);

      
      return data;
    } catch (err) {
      console.error(err);
      throw err; // Re-throw to allow calling code to handle the error
    }
  }


  async getUserData(ids: string[]) {
    // const bodyData = JSON.stringify({ accountIds: ids });
    // console.log(bodyData);
    console.log("hereeeeeeeeeeee");
    console.log(ids);
    const bodyData = {
      "accountIds": ids
    };
    try {
      const response = await fetch('https://sweetenteam.atlassian.net/wiki/api/v2/users-bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from('sweetenteam@gmail.com:' + process.env.ATLASSIAN_API_KEY).toString('base64')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
   
      return await response.json();
    } catch (error) {
      console.error('Error fetching owners:', error);
      return null;
    }
  }


async fetchConfluencePages(daysBack?: number): Promise<{ results: any[] }> {
  const baseUrl = 'https://sweetenteam.atlassian.net/wiki';
  const searchEndpoint = '/rest/api/content/search';
  const username = 'sweetenteam@gmail.com';
  const auth = 'Basic ' + btoa(`${username}:${process.env.ATLASSIAN_API_KEY}`);

  let cqlQuery = "";
  if (daysBack !== undefined) {
    cqlQuery = `lastModified >= now("-${daysBack}d") or created >= now("-${daysBack}d")`;
  }
  const expandParams = '&expand=space,createdBy,history.ownedBy,body.storage';
  const limit = 25;

  cqlQuery += ' type=page';
  
  let allResults: any[] = [];
  let nextUrl = `${baseUrl}${searchEndpoint}?cql=${cqlQuery}&${expandParams}&limit=${limit}`;

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch pages:', response.statusText);
      throw new Error(`Failed to fetch pages: ${response.statusText}`);
    }

    const data = await response.json();
    allResults = allResults.concat(data.results);

    // Check if there are more results
    if (data._links?.next) {
      // Combine the base URL with the next URL from the response
      nextUrl = `${baseUrl}${data._links.next}`;
    } else {
      nextUrl = '';
    }
  }

  return { results: allResults };
}


}






//const confluenceAPI = new ConfluenceAPIFacade();
//async function ziomela(): Promise<void> {
// console.log(((await confluenceAPI.fetchLastUpdatedDocuments()).results[0].content));
//}
//ziomela();
