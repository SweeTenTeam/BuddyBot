import { ConfluenceCmd } from '../../domain/command/ConfluenceCmd.js';
import { ConfluenceAPIAdapter } from './ConfluenceAPIAdapter.js';
import { ConfluenceAPIFacade } from './ConfluenceAPIFacade.js';

describe('ConfluenceAPIFacade', () => {
  let confluenceAPIFacade: ConfluenceAPIFacade;
  let confluenceAPIADapter: ConfluenceAPIAdapter;

  beforeEach(() => {
    confluenceAPIFacade = new ConfluenceAPIFacade(
      process.env.CONFLUENCE_BASE_URL || 'your_confluence_url',
      process.env.CONFLUENCE_USERNAME || 'your_confluence_email',
      process.env.ATLASSIAN_API_KEY || 'your_api_key'
    );
    confluenceAPIADapter = new ConfluenceAPIAdapter(confluenceAPIFacade);
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
    // const res = await confluenceAPIFacade.fetchConfluencePages();
    // console.log(res);
    
    // Test with last 7 days
    // await confluenceAPIFacade.fetchConfluencePages(7);
    
    // // Test with last 30 days
    // await confluenceAPIFacade.fetchConfluencePages(30);
    
    // // Test with last 100 days
    // await confluenceAPIFacade.fetchConfluencePages(100);

    const date = new Date();
    date.setDate(date.getDate() - 100);
    const cmd = new ConfluenceCmd(date);
    // cmd.lastUpdate = date;
    confluenceAPIADapter.fetchDocuments(cmd);
  }, 300000); // Increased timeout for multiple API calls
}); 