export interface GithubUseCase {
    getHello(): string;
}


export const GITHUB_USECASE = Symbol('GITHUB_USECASE');
