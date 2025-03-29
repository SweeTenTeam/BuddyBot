import { GithubInfo } from "src/domain/business/GithubInfo.js";

export interface GithubStoreInfoPort {
    storeGithubInfo(req: GithubInfo): Promise<boolean>
}