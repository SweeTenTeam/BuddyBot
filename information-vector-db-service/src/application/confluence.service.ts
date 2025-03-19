import { Injectable } from '@nestjs/common';
import { ConfluenceUseCase } from './port/in/ConfluenceUseCase.js';
import { ConfluenceCmd } from '../domain/command/ConfluenceCmd.js';
import { ConfluenceAPIPort } from './port/out/ConfluenceAPIPort.js';

@Injectable()
export class ConfluenceService implements ConfluenceUseCase {
  private readonly confluenceAPIAdapter: ConfluenceAPIPort;
  constructor(confluenceAPIAdapter: ConfluenceAPIPort) {
    this.confluenceAPIAdapter = confluenceAPIAdapter;
  }

  async fetchAndStoreConfluenceInfo(req: ConfluenceCmd): Promise<boolean> {
    const documents = await this.confluenceAPIAdapter.fetchDocuments(req);
    console.log(documents[10]);
    //store logic
    return true;
  }
}
