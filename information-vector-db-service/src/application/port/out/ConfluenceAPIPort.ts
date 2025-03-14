import { ConfluenceCmd } from 'src/domain/ConfluenceCmd';
import { ConfluenceDocument } from 'src/domain/ConfluenceDocument';

export abstract class ConfluenceAPIPort {
  fetchDocuments(req: ConfluenceCmd): Promise<ConfluenceDocument[]> {
    return new ConfluenceDocument[2];
  };
}
