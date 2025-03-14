import { Injectable } from '@nestjs/common';
import { ConfluenceAPIPort } from 'src/application/port/out/ConfluenceAPIPort';
import { ConfluenceCmd } from 'src/domain/ConfluenceCmd';
import { ConfluenceAPIFacade } from './ConfluenceAPIFacade';
import { ConfluenceDocument } from 'src/domain/ConfluenceDocument';

@Injectable()
export class ConfluenceAPIAdapter implements ConfluenceAPIPort {
  private readonly confluenceAPI: ConfluenceAPIFacade;
  constructor(confluenceAPI: ConfluenceAPIFacade) {
    this.confluenceAPI = confluenceAPI;
  }

  async fetchDocuments(req: ConfluenceCmd): Promise<ConfluenceDocument[]> {
    const result: ConfluenceDocument[] = [];
    return result;
  }
}
