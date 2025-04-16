import { ConfluenceDocument } from '../../../domain/business/ConfluenceDocument.js';
import { Result } from '../../../domain/business/Result.js';

export const CONFLUENCE_STORE_INFO_PORT = Symbol('CONFLUENCE_STORE_INFO_PORT');

export interface ConfluenceStoreInfoPort {
  storeDocuments(req: ConfluenceDocument[]): Promise<Result>;
}
