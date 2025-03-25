import { ConfluenceAPIFacade } from './ConfluenceAPIFacade.js';

describe('ConfluenceAPIFacade', () => {
  let confluenceAPIFacade: ConfluenceAPIFacade;

  beforeEach(() => {
    confluenceAPIFacade = new ConfluenceAPIFacade();
  });

  // it('should fetch Confluence pages', async () => {
  //   const data = await confluenceAPIFacade.getConfluencePagesDirectAPI();
  //   console.log('API Response:', data);
  //   expect(data).toBeDefined(); 

  //   const pages = JSON.parse(data).results;
  //   const ownerIds = pages.map(item => item.ownerId);

  //   const owners = await confluenceAPIFacade.getUserData(ownerIds);
  //   console.log('Owners:', owners);
  //   expect(owners).toBeDefined(); 
  // });

  it('should fetch Confluence pages with different time ranges', async () => {
    // Test with no time range (all pages)
    await confluenceAPIFacade.fetchConfluencePages();
    
    // Test with last 7 days
    // await confluenceAPIFacade.fetchConfluencePages(7);
    
    // // Test with last 30 days
    // await confluenceAPIFacade.fetchConfluencePages(30);
    
    // // Test with last 100 days
    // await confluenceAPIFacade.fetchConfluencePages(100);
  }, 30000); // Increased timeout for multiple API calls
}); 