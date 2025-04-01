import { GithubInfo } from "src/domain/business/GithubInfo.js";

export const GITHUB_STORE_INFO_PORT = Symbol('GITHUB_STORE_INFO_PORT');

export interface GithubStoreInfoPort {
    storeGithubInfo(req: GithubInfo): Promise<boolean>
}