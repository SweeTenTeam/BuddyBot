import { Controller, Get, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReqAnswerCmd } from 'src/application/commands/request-answer.cmd';
import { ELABORAZIONE_USE_CASE, ElaborazioneUseCase } from 'src/application/use-cases/elaborazione.use-case';
import { ReqAnswerDTO } from 'src/interfaces/dto/request-answer.dto';

@Controller()
export class ChatController {
  constructor(@Inject(ELABORAZIONE_USE_CASE) private readonly elaborazioneUseCase: ElaborazioneUseCase) {}

  @MessagePattern('get.answer')
  async getAnswer(@Payload() queryData: ReqAnswerDTO) {
    this.elaborazioneUseCase.getAnswer(new ReqAnswerCmd(queryData.text, queryData.date));
  }
}