import { Injectable } from '@nestjs/common';
import { Chat } from '../../domain/entities/chat.entity';
import { ReqAnswerCmd } from '../commands/request-answer.cmd';
import { ElaborazioneService } from '../../core/services/elaborazione.service';

export const ELABORAZIONE_USE_CASE = 'ELABORAZIONE_USE_CASE'; // Token simbolico

export interface ElaborazioneUseCase {
  getAnswer(req: ReqAnswerCmd): Promise<Chat>;
}