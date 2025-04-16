import { Controller, Get, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RETRIEVAL_USE_CASE, RetrievalUseCase } from '../../application/port/in/retrieval-usecase.port.js';
import { RetrieveCmd } from '../../domain/command/retreive-cmd.js';
import { RetrievalQueryDTO } from './dto/retrival-query.dto.js';
import { InformationDTO } from './dto/information.dto.js';
import { Information } from '../../domain/business/information.js';
import { MetadataDTO } from './dto/metadata.dto.js';

@Controller()
export class RetrievalController {
  constructor(@Inject(RETRIEVAL_USE_CASE) private readonly retrievalService: RetrievalUseCase) {}

  @MessagePattern('retrieve.information')
  async retrieveInformation(@Payload() queryData: RetrievalQueryDTO): Promise<InformationDTO[]> {
    console.log(`Received query: ${queryData.query}`);
  
    try {
      const retrieveCmd = new RetrieveCmd();
      retrieveCmd.query = queryData.query;
      const results = await this.retrievalService.retrieveRelevantInfo(retrieveCmd);
      console.log(`Found ${results.length} results for query`);
      
      // Convert domain Information objects to InformationDTO objects
      return results.map(info => this.toInformationDTO(info));
    } catch (error) {
      console.error('Error retrieving information:', error);
      throw error;
    }
  }

  
  private toInformationDTO(info: Information): InformationDTO {
    const metadataDTO = new MetadataDTO(
      info.metadata.origin,
      info.metadata.type,
      info.metadata.originID
    );
    
    return new InformationDTO(
      info.content,
      metadataDTO
    );
  }
}