import { Injectable } from "@nestjs/common";
import { JiraStoreInfoPort } from "../../application/port/out/JiraStoreInfoPort.js";
import { Information } from "../../domain/business/information.js";
import { Ticket } from "../../domain/business/Ticket.js";
import { QdrantInformationRepository } from "./persistance/qdrant-information-repository.js";
import { Result } from "../../domain/business/Result.js";

@Injectable()
export class JiraStoreAdapter implements JiraStoreInfoPort {
    constructor(
        private readonly repository: QdrantInformationRepository
    ) {}

    async storeTickets(req: Ticket[]): Promise<Result> {
        try {
            for(const ticket of req){
                const result = await this.repository.storeInformation(new Information(ticket.toStringifiedJson(), ticket.getMetadata()));
                if (!result.success) {
                    return Result.fail(`Failed to store ticket: ${result.error}`);
                }
            }
            return Result.ok();
        } catch (error) {
            return Result.fromError(error);
        }
    }
}