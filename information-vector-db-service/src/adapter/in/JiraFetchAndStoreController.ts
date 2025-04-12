import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JIRA_USECASE, JiraUseCase } from '../../application/port/in/JiraUseCase.js';
import { JiraCmd } from '../../domain/command/JiraCmd.js';
import { Result } from '../../domain/business/Result.js';
import { FetchJiraDto } from './dto/FetchJira.dto.js';

@Controller()
export class JiraFetchAndStoreController {
  constructor(
    @Inject(JIRA_USECASE) private readonly jiraService: JiraUseCase,
  ) {}

  @MessagePattern('fetchAndStoreJira')
  async fetchAndStore(@Payload() req: FetchJiraDto): Promise<Result> {
    try {
      const result = await this.jiraService.fetchAndStoreJiraInfo(
        new JiraCmd(req.boardId, req.lastUpdate ? new Date(req.lastUpdate) : undefined),
      );
      return result;
    } catch (error) {
      return Result.fromError(error);
    }
  }
} 