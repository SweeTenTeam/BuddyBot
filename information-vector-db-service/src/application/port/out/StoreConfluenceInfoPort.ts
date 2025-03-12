import { ConfluenceDocument } from "src/domain/ConfluenceDocument";

export interface StoreConfluenceInfoPort {
  storeDocuments(req: ConfluenceDocument[]): boolean;
}
