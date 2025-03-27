import { ConfluenceCmd } from '../../../domain/command/ConfluenceCmd.js';
import { ConfluenceDocument } from '../../../domain/business/ConfluenceDocument.js';

export abstract class ConfluenceAPIPort {
  fetchDocuments(req: ConfluenceCmd): Promise<ConfluenceDocument[]> {
    return new ConfluenceDocument[2];
  };
}
