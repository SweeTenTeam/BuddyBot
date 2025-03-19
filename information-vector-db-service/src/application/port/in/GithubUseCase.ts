import { GithubCmd } from "src/domain/command/GithubCmd.js";

export interface GithubUseCase {
    fetchAndStoreGithubInfo(req: GithubCmd): Promise<boolean>;
}

export const GITHUB_USECASE = Symbol('GITHUB_USECASE');