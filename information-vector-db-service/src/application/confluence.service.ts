import { Inject, Injectable } from '@nestjs/common';
import { ConfluenceUseCase } from './port/in/ConfluenceUseCase.js';
import { ConfluenceCmd } from '../domain/command/ConfluenceCmd.js';
import { ConfluenceAPIPort, CONFLUENCE_API_PORT } from './port/out/ConfluenceAPIPort.js';
import { ConfluenceStoreInfoPort, CONFLUENCE_STORE_INFO_PORT } from './port/out/ConfluenceStoreInfoPort.js';

@Injectable()
export class ConfluenceService implements ConfluenceUseCase {
  constructor(
    @Inject(CONFLUENCE_API_PORT) private readonly confluenceAPIAdapter: ConfluenceAPIPort,
    @Inject(CONFLUENCE_STORE_INFO_PORT) private readonly confluenceStoreAdapter: ConfluenceStoreInfoPort
  ) {}

  async fetchAndStoreConfluenceInfo(req: ConfluenceCmd): Promise<boolean> {
    const documents = await this.confluenceAPIAdapter.fetchDocuments(req);
    console.log(documents[10]); // just seeing
    await this.confluenceStoreAdapter.storeDocuments(documents);
    //store logic
    return true;
  }
}
