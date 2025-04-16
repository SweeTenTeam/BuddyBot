import { Injectable } from '@nestjs/common';
import { Chat } from '../../domain/entities/chat.entity.js';
import { ReqAnswerCmd } from '../commands/request-answer.cmd.js';
import { ElaborazioneService } from '../../core/services/elaborazione.service.js';

export const ELABORAZIONE_USE_CASE = 'ELABORAZIONE_USE_CASE'; // Token simbolico

export interface ElaborazioneUseCase {
  getAnswer(req: ReqAnswerCmd): Promise<Chat>;
}