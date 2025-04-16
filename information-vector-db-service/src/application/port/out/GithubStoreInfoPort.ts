import { GithubInfo } from "../../../domain/business/GithubInfo.js";
import { Result } from "../../../domain/business/Result.js";

export const GITHUB_STORE_INFO_PORT = Symbol('GITHUB_STORE_INFO_PORT');

export interface GithubStoreInfoPort {
    storeGithubInfo(req: GithubInfo): Promise<Result>
}