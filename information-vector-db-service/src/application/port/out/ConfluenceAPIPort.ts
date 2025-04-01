import { ConfluenceCmd } from '../../../domain/command/ConfluenceCmd.js';
import { ConfluenceDocument } from '../../../domain/business/ConfluenceDocument.js';

export const CONFLUENCE_API_PORT = Symbol('CONFLUENCE_API_PORT');

export interface ConfluenceAPIPort {
  fetchDocuments(req: ConfluenceCmd): Promise<ConfluenceDocument[]>;
}
