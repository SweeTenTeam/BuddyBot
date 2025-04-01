import { Injectable } from "@nestjs/common";
import { GithubStoreInfoPort } from "../../application/port/out/GithubStoreInfoPort.js";
import { GithubInfo } from "../../domain/business/GithubInfo.js";
import { QdrantInformationRepository } from "./persistance/qdrant-information-repository.js";
import { Information } from "../../domain/business/information.js";

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
        for(const repo of req.repos){
            await this.repository.storeInformation(new Information(repo.toStringifiedJson(),repo.getMetadata()));

        }
        
        for(const workflow of req.workflows){
             await this.repository.storeInformation(new Information(workflow.toStringifiedJson(),workflow.getMetadata()));
        }
        for(const workflowRun of req.workflow_runs){
             await this.repository.storeInformation(new Information(workflowRun.toStringifiedJson(),workflowRun.getMetadata()));
        }




        //store workflows TBD
        return true;
    }
}