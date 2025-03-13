import { ConfluenceCmd } from '../../../domain/ConfluenceCmd.js';
import { ConfluenceDocument } from '../../../domain/ConfluenceDocument.js';

export interface ConfluenceAPIPort {
  fetchDocuments(req: ConfluenceCmd): Promise<ConfluenceDocument[]>;
}
