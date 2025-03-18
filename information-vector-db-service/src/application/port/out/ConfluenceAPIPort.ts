import { ConfluenceCmd } from '../../../domain/ConfluenceCmd.js';
import { ConfluenceDocument } from '../../../domain/ConfluenceDocument.js';

export abstract class ConfluenceAPIPort {
  fetchDocuments(req: ConfluenceCmd): Promise<ConfluenceDocument[]> {
    return new ConfluenceDocument[2];
  };
}
