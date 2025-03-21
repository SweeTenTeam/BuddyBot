import { Injectable } from "@nestjs/common";
import { GithubStoreInfoPort } from "src/application/port/out/GithubStoreInfoPort.js";
import { GithubInfo } from "src/domain/business/GithubInfo.js";
import { QdrantInformationRepository } from "./persistance/qdrant-information-repository.js";
import { Information } from "src/domain/business/information.js";

@Injectable()
export class GithubStoreAdapter implements GithubStoreInfoPort {
    constructor(
            private readonly repository: QdrantInformationRepository
    ) {}

    async storeGithubInfo(req: GithubInfo): Promise<boolean> {
        for(const commit of req.commits){
            await this.repository.storeInformation(new Information(commit.toStringifiedJson(),commit.getMetadata()));
        }
        for(const file of req.files){
            await this.repository.storeInformation(new Information(file.toStringifiedJson(),file.getMetadata()));
        }
        for(const pullRequest of req.pullRequests){
            await this.repository.storeInformation(new Information(pullRequest.toStringifiedJson(),pullRequest.getMetadata()));
        }
        await this.repository.storeInformation(new Information(req.repo.toStringifiedJson(),req.repo.getMetadata()));

        //store workflows TBD

        return true;
    }
}