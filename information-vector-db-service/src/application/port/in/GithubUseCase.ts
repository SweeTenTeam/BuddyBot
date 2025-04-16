import { GithubCmd } from "../../../domain/command/GithubCmd.js";
import { Result } from "../../../domain/business/Result.js";

export interface GithubUseCase {
    fetchAndStoreGithubInfo(req: GithubCmd): Promise<Result>;
}

export const GITHUB_USECASE = Symbol('GITHUB_USECASE');