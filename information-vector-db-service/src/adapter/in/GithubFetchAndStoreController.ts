import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GITHUB_USECASE, GithubUseCase } from '../../application/port/in/GithubUseCase.js';
import { GithubCmd } from '../../domain/command/GithubCmd.js';
import { RepoCmd } from '../../domain/command/RepoCmd.js';
import { Result } from '../../domain/business/Result.js';
import { FetchGithubDto } from './dto/FetchGithub.dto.js';

@Controller()
export class GithubFetchAndStoreController {
  constructor(
    @Inject(GITHUB_USECASE) private readonly githubService: GithubUseCase,
  ) {}

  @MessagePattern('fetchAndStoreGithub')
  async fetchAndStore(@Payload() req: FetchGithubDto): Promise<Result> {
    try {
      const repoCmdList = req.repoDTOList.map(repoDto => {
         return new RepoCmd(repoDto.owner, repoDto.repoName, repoDto.branch_name); 
      });

      const result = await this.githubService.fetchAndStoreGithubInfo(
        new GithubCmd(repoCmdList, req.lastUpdate ? new Date(req.lastUpdate) : undefined)
      );
      return result;
    } catch (error) {
      return Result.fromError(error);
    }
  }
} 