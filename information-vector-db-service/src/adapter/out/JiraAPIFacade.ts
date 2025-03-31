import { Injectable } from '@nestjs/common';
import { AgileClient, AgileModels, Version3Client, Version3Models } from 'jira.js';
import { json } from 'stream/consumers';

export class JiraAPIFacade {
  constructor(private jiraClientV3: Version3Client) {}


  async fetchRecentIssues(daysBack?: number,boardId?: number): Promise<Version3Models.Issue[]> {
    let jqlQuery = daysBack ? `(created >= -${daysBack}d OR updated >= -${daysBack}d)`: `(created >= -10000d OR updated >= -10000d)`//if daysBack not passed get all the issues setting daysback around 30 years back
    console.log(jqlQuery)
    let allResults: Version3Models.Issue[] = [];
    let nextPageToken: string | undefined;

    while (true) {
      const searchParams = {
        // expand: "names",//used if you need to know the custom_id meaning
        jql: jqlQuery,
        fields: ["*all"],
        ...(nextPageToken && { nextPageToken })
      };

      const response = await this.jiraClientV3.issueSearch.searchForIssuesUsingJqlEnhancedSearch(searchParams);
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
