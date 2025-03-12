import { Injectable } from '@nestjs/common';
import { ConfluenceUseCase } from './port/in/ConfluenceUseCase';
import { ConfluenceCmd } from 'src/domain/ConfluenceCmd';
import { ConfluenceAPIPort } from './port/out/ConfluenceAPIPort';

@Injectable()
export class ConfluenceService implements ConfluenceUseCase {
  private readonly confluenceAPIAdapter: ConfluenceAPIPort;
  constructor(confluenceAPIAdapter: ConfluenceAPIPort) {
    this.confluenceAPIAdapter = confluenceAPIAdapter;
  }

  async fetchAndStoreConfluenceInfo(req: ConfluenceCmd): Promise<boolean> {
    const documents = await this.confluenceAPIAdapter.fetchDocuments(req);
    //store logic
    return true;
  }
}
