import { ConfluenceDocument } from '../../../domain/ConfluenceDocument.js';


export interface StoreConfluenceInfoPort {
  storeDocuments(req: ConfluenceDocument[]): boolean;
}
