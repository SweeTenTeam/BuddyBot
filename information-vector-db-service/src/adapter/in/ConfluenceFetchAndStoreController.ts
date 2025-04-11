import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CONFLUENCE_USECASE, ConfluenceUseCase } from '../../application/port/in/ConfluenceUseCase.js';
import { ConfluenceCmd } from '../../domain/command/ConfluenceCmd.js';
import { Result } from '../../domain/business/Result.js';
import { FetchConfluenceDto } from './dto/FetchConfluence.dto.js';

@Controller()
export class ConfluenceFetchAndStoreController {
  constructor(
    @Inject(CONFLUENCE_USECASE) private readonly confluenceService: ConfluenceUseCase,
  ) {}

  @MessagePattern('fetchAndStoreConfluence')
  async fetchAndStore(@Payload() req: FetchConfluenceDto): Promise<Result> {
    try {
      const result = await this.confluenceService.fetchAndStoreConfluenceInfo(
        new ConfluenceCmd(req.lastUpdate ? new Date(req.lastUpdate) : undefined),
      );
      return result;
    } catch (error) {
      return Result.fromError(error);
    }
  }
} 