import { ConfluenceCmd } from "src/domain/ConfluenceCmd";
import { ConfluenceDocument } from "src/domain/ConfluenceDocument";

export interface ConfluenceAPIPort {
  fetchDocuments(req: ConfluenceCmd): Promise<ConfluenceDocument[]>;
}
