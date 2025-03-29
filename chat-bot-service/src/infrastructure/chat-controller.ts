import { Controller, Get, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReqAnswerCmd } from '../application/commands/request-answer.cmd.js';
import { ELABORAZIONE_USE_CASE, ElaborazioneUseCase } from '../application/use-cases/elaborazione.use-case.js';
import { ReqAnswerDTO } from '../interfaces/dto/request-answer.dto.js';

@Controller()
export class ChatController {
  constructor(@Inject(ELABORAZIONE_USE_CASE) private readonly elaborazioneUseCase: ElaborazioneUseCase) {}

  @MessagePattern('get-answer')
  async getAnswer(@Payload() queryData: ReqAnswerDTO) {
    return await this.elaborazioneUseCase.getAnswer(new ReqAnswerCmd(queryData.text, queryData.date));
  }
}