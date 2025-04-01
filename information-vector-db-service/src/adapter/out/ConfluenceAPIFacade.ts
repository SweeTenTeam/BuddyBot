import { Injectable } from '@nestjs/common';

export class ConfluenceAPIFacade {
  constructor(
    private readonly baseURL: string,
    private readonly username: string,
    private readonly atlassianApiKey: string
  ) {}

  async fetchConfluencePages(daysBack?: number): Promise<{ results: any[] }> {
    const searchEndpoint = '/rest/api/content/search';
    const auth = 'Basic ' + btoa(`${this.username}:${this.atlassianApiKey}`);
    console.log(daysBack);
    let cqlQuery = 'type = page';
    cqlQuery += daysBack ? ` and (lastModified >= now("-${daysBack}d") or created >= now("-${daysBack}d"))` : ` and (lastModified >= now("-10000d") or created >= now("-10000d"))`; //if daysBack undefined get all the pages using very high daysBack
    const expandParams = 'expand=space,createdBy,history.ownedBy,body.storage';
    const limit = 25;

    let allResults: any[] = [];
    let nextUrl = `${this.baseURL}${searchEndpoint}?cql=${cqlQuery}&${expandParams}&limit=${limit}`;

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
        nextUrl = `${this.baseURL}${data._links.next}`;
      } else {
        nextUrl = '';
      }
    }
    return { results: allResults };
  }
}