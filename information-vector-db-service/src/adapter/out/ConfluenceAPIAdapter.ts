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
    const documents = await this.confluenceAPI.fetchDocuments();
    for(const document of documents.results){
      result.push(new ConfluenceDocument(
        document.id,
        document.title,
        document.status,
        document.history?.createdBy.displayName || '',
        document.history?.createdBy.displayName || '', //to fix non existant type ownedBy
        document.body?.storage?.value || '',
        document.space?.key || ''
      ));
    }
    console.log(result);
    return result;
  }
}
