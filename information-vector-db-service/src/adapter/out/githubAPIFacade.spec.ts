import { GithubAPIFacade } from './GithubAPIFacade.js';

describe('GithubAPIFacade', () => {
  let githubAPIFacade: GithubAPIFacade;

  beforeEach(() => {
    githubAPIFacade = new GithubAPIFacade();
  });

//   it('should fetch repository information', async () => {
//     const data = await githubAPIFacade.fetchRepositoryInfo();
//     console.log('Repository Info:', data.data);
//     expect(data.data).toBeDefined();
//   });

//   it('should fetch pull requests information', async () => {
//     const data = await githubAPIFacade.fetchPullRequestsInfo();
//     console.log('Pull Requests:', data.data);
//     expect(data.data).toBeDefined();
//   });

//   it('should fetch commits information', async () => {
//     const data = await githubAPIFacade.fetchCommitsInfo();
//     console.log('Commits:', data.data);
//     expect(data.data).toBeDefined();
//   });

  it('should fetch workflows information', async () => {
    try {
      const data = await githubAPIFacade.fetchWorkflowsInfo();
      console.log('Workflows:', data);
      if (data && data.length > 0 && data[0].runs) {
        console.log("Total runs for first workflow:", data[0].runs.length);
        console.log("Sample run:", data[0].runs[0]);
      }
      expect(data).toBeDefined();
    } catch (error) {
      console.error("Error fetching workflows:", error);
      throw error;
    }
  });

//   it('should fetch files information', async () => {
//     const data = await githubAPIFacade.fetchFilesInfo('main');
//     console.log('Files:', data.data);
//     expect(data.data).toBeDefined();
//   });

//   it('should fetch pull request comments', async () => {
//     const data = await githubAPIFacade.fetchPullRequestComments(1);
//     console.log('Pull Request Comments:', data);
//     expect(data).toBeDefined();
//   });

//   it('should fetch pull request review comments', async () => {
//     const data = await githubAPIFacade.fetchPullRequestReviewComments(1);
//     console.log('Pull Request Review Comments:', data);
//     expect(data).toBeDefined();
//   });
}); 