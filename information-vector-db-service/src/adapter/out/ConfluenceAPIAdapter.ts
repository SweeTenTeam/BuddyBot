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
    const days = req.lastUpdate ? 
      Math.ceil((new Date().getTime() - req.lastUpdate.getTime()) / (1000 * 60 * 60 * 24)) : 
      undefined;
    
    const rawData = await this.confluenceAPI.fetchConfluencePages(days);
    // console.log(rawData)
    const documents = rawData.results;


    const conf_docs = documents.map(document => new ConfluenceDocument(
      document.id,
      document.title,
      document.status,
      document.history?.createdBy?.displayName,
      document.history?.ownedBy?.displayName,
      document.space?.id,
      document.body?.storage?.value
    ));
     console.log(conf_docs.length);
    //  console.log(conf_docs[0].getContent());
    return conf_docs;
  }

}
