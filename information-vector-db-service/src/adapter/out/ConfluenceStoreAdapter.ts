import { Injectable } from "@nestjs/common";
import { ConfluenceStoreInfoPort } from "../../application/port/out/ConfluenceStoreInfoPort.js";
import { ConfluenceDocument } from "../../domain/business/ConfluenceDocument.js";
import { QdrantInformationRepository } from "./persistance/qdrant-information-repository.js";
import { Information } from "../../domain/business/information.js";

@Injectable()
export class ConfluenceStoreAdapter implements ConfluenceStoreInfoPort {
    constructor(
        private readonly repository: QdrantInformationRepository
    ) {}
    async storeDocuments(req: ConfluenceDocument[]): Promise<boolean> {
        for(const document of req){
            await this.repository.storeInformation(new Information(document.toStringifiedJson(),document.getMetadata()));
        }
        return true;
    }
}