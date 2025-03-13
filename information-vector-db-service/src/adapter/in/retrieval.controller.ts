
import { Controller, Get, Inject } from '@nestjs/common';
import { RETRIEVAL_USE_CASE, RetrievalUseCase } from '../../application/port/in/retrieval-usecase.port';


@Controller()
export class RetrievalController {
  
  constructor(@Inject(RETRIEVAL_USE_CASE) private readonly retrievalService:  RetrievalUseCase) {}


}