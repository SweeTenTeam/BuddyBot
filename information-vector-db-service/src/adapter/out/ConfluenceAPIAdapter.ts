import { Injectable } from '@nestjs/common';
import { ConfluenceAPIPort } from '../../application/port/out/ConfluenceAPIPort.js';
import { ConfluenceCmd } from '../../domain/command/ConfluenceCmd.js';
import { ConfluenceAPIFacade } from './ConfluenceAPIFacade.js';
import { ConfluenceDocument } from '../../domain/business/ConfluenceDocument.js';
import fetch from 'node-fetch';

@Injectable()
export class ConfluenceAPIAdapter implements ConfluenceAPIPort {
  private readonly confluenceAPI: ConfluenceAPIFacade;
  constructor(confluenceAPI: ConfluenceAPIFacade) {
    this.confluenceAPI = confluenceAPI;
  }

  async fetchDocuments(req: ConfluenceCmd): Promise<ConfluenceDocument[]> {
    const result: ConfluenceDocument[] = [];
    const documents = await this.confluenceAPI.fetchDocuments();
    for(const document of documents.results){
      result.push(new ConfluenceDocument(
        document.id,
        document.title,
        document.status,
        document.history?.createdBy.displayName || '',
        '',//document.history?.ownedBy.displayName || '', //fix AGAIN
        document.space?.id || -1,
        document.body?.storage?.value || ''
      ));
    }
    return result;
  }


}
