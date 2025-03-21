import { Injectable } from "@nestjs/common";
import { JiraStoreInfoPort } from "src/application/port/out/JiraStoreInfoPort.js";
import { Information } from "src/domain/business/information.js";
import { Ticket } from "src/domain/business/Ticket.js";
import { QdrantInformationRepository } from "./persistance/qdrant-information-repository.js";

@Injectable()
export class JiraStoreAdapter implements JiraStoreInfoPort {
    constructor(
        private readonly repository: QdrantInformationRepository
    ) {}
    
    async storeTickets(req: Ticket[]): Promise<boolean> {
        for(const ticket of req){
            await this.repository.storeInformation(new Information(ticket.toStringifiedJson(),ticket.getMetadata()));
        }
        return true;
    }
}