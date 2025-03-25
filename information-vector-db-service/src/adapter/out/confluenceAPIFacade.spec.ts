import { ConfluenceAPIFacade } from './ConfluenceAPIFacade.js';

describe('ConfluenceAPIFacade', () => {
  let confluenceAPIFacade: ConfluenceAPIFacade;

  beforeEach(() => {
    confluenceAPIFacade = new ConfluenceAPIFacade();
  });

  it('should fetch Confluence pages', async () => {
    const data = await confluenceAPIFacade.getConfluencePagesDirectAPI();
    console.log('API Response:', data);
    expect(data).toBeDefined(); // Ensure that some data is returned

    // Parse the response to extract owner IDs
    const pages = JSON.parse(data).results;
    const ownerIds = pages.map(item => item.ownerId);

    // Fetch and log the owners' names
    const owners = await confluenceAPIFacade.getOwnersName(ownerIds);
    console.log('Owners:', owners);
    expect(owners).toBeDefined(); // Ensure that owners' data is returned
  });
}); 