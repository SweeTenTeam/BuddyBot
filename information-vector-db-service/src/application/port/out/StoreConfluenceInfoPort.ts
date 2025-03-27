import { ConfluenceDocument } from '../../../domain/business/ConfluenceDocument.js';


export interface StoreConfluenceInfoPort {
  storeDocuments(req: ConfluenceDocument[]): boolean;
}
