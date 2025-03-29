import { Injectable } from '@nestjs/common';
import { ConfluenceUseCase } from './port/in/ConfluenceUseCase.js';
import { ConfluenceCmd } from '../domain/command/ConfluenceCmd.js';
import { ConfluenceAPIPort } from './port/out/ConfluenceAPIPort.js';
import { ConfluenceStoreAdapter } from 'src/adapter/out/ConfluenceStoreAdapter.js';

@Injectable()
export class ConfluenceService implements ConfluenceUseCase {
  private readonly confluenceAPIAdapter: ConfluenceAPIPort;
  private readonly confluenceStoreAdapter: ConfluenceStoreAdapter;
  constructor(confluenceAPIAdapter: ConfluenceAPIPort, confluenceStoreAdapter: ConfluenceStoreAdapter) {
    this.confluenceAPIAdapter = confluenceAPIAdapter;
    this.confluenceStoreAdapter = confluenceStoreAdapter;
  }

  async fetchAndStoreConfluenceInfo(req: ConfluenceCmd): Promise<boolean> {
    const documents = await this.confluenceAPIAdapter.fetchDocuments(req);
    console.log(documents[10]); // just seeing
    await this.confluenceStoreAdapter.storeDocuments(documents);
    //store logic
    return true;
  }
}
