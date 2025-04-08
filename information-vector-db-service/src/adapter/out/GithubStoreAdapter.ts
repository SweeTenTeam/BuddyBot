import { Injectable } from "@nestjs/common";
import { GithubStoreInfoPort } from "../../application/port/out/GithubStoreInfoPort.js";
import { GithubInfo } from "../../domain/business/GithubInfo.js";
import { QdrantInformationRepository } from "./persistance/qdrant-information-repository.js";
import { Information } from "../../domain/business/information.js";
import { Result } from "../../domain/business/Result.js";

@Injectable()
export class GithubStoreAdapter implements GithubStoreInfoPort {
    constructor(
        private readonly repository: QdrantInformationRepository
    ) {}

    async storeGithubInfo(req: GithubInfo): Promise<Result> {
        try {
            // Store commits
            for(const commit of req.commits){
                const result = await this.repository.storeInformation(new Information(commit.toStringifiedJson(), commit.getMetadata()));
                if (!result.success) {
                    return Result.fail(`Failed to store commit: ${result.error}`);
                }
            }
            
            // Store files
            for(const file of req.files){
                const result = await this.repository.storeInformation(new Information(file.toStringifiedJson(), file.getMetadata()));
                if (!result.success) {
                    return Result.fail(`Failed to store file: ${result.error}`);
                }
            }
            
            // Store pull requests
            for(const pullRequest of req.pullRequests){
                const result = await this.repository.storeInformation(new Information(pullRequest.toStringifiedJson(), pullRequest.getMetadata()));
                if (!result.success) {
                    return Result.fail(`Failed to store pull request: ${result.error}`);
                }
            }
            
            // Store repositories
            for(const repo of req.repos){
                const result = await this.repository.storeInformation(new Information(repo.toStringifiedJson(), repo.getMetadata()));
                if (!result.success) {
                    return Result.fail(`Failed to store repository: ${result.error}`);
                }
            }
            
            // Store workflows
            for(const workflow of req.workflows){
                const result = await this.repository.storeInformation(new Information(workflow.toStringifiedJson(), workflow.getMetadata()));
                if (!result.success) {
                    return Result.fail(`Failed to store workflow: ${result.error}`);
                }
            }
            
            // Store workflow runs
            for(const workflowRun of req.workflow_runs){
                const result = await this.repository.storeInformation(new Information(workflowRun.toStringifiedJson(), workflowRun.getMetadata()));
                if (!result.success) {
                    return Result.fail(`Failed to store workflow run: ${result.error}`);
                }
            }

            return Result.ok();
        } catch (error) {
            return Result.fromError(error);
        }
    }
}