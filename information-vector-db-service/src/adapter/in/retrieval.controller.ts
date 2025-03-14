import { Controller, Get, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RETRIEVAL_USE_CASE, RetrievalUseCase } from '../../application/port/in/retrieval-usecase.port.js';
import { RetrieveCmd } from '../../domain/retreive-cmd.js';
import { RetrievalQueryDTO } from './dto/retrival-query.dto.js';

@Controller()
export class RetrievalController {
  constructor(@Inject(RETRIEVAL_USE_CASE) private readonly retrievalService: RetrievalUseCase) {}

  @MessagePattern('retrieve.information')
  async retrieveInformation(@Payload() queryData: RetrievalQueryDTO) {
    console.log(`Received query: ${queryData.query}`);
  
    try {
      const retrieveCmd = new RetrieveCmd();
      retrieveCmd.query = queryData.query;
      const results = await this.retrievalService.retrieveRelevantInfo(retrieveCmd);
      console.log(`Found ${results.length} results for query`);
      return results;
    } catch (error) {
      console.error('Error retrieving information:', error);
      throw error;
    }
  }
}