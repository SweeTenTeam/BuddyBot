import { ConfluenceDocument } from '../../../domain/business/ConfluenceDocument.js';


export interface ConfluenceStoreInfoPort {
  storeDocuments(req: ConfluenceDocument[]): Promise<boolean>;
}
