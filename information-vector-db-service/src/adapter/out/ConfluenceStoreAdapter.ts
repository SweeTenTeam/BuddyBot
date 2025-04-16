import { Injectable } from "@nestjs/common";
import { ConfluenceStoreInfoPort } from "../../application/port/out/ConfluenceStoreInfoPort.js";
import { ConfluenceDocument } from "../../domain/business/ConfluenceDocument.js";
import { QdrantInformationRepository } from "./persistance/qdrant-information-repository.js";
import { Information } from "../../domain/business/information.js";
import { Result } from "../../domain/business/Result.js";

@Injectable()
export class ConfluenceStoreAdapter implements ConfluenceStoreInfoPort {
    constructor(
        private readonly repository: QdrantInformationRepository
    ) {}
    async storeDocuments(req: ConfluenceDocument[]): Promise<Result> {
        try {
            for(const document of req){
                const result = await this.repository.storeInformation(new Information(document.toStringifiedJson(), document.getMetadata()));
                if (!result.success) {
                    return Result.fail(`Failed to store document: ${result.error}`);
                }
            }
            return Result.ok();
        } catch (error) {
            return Result.fromError(error);
        }
    }
}