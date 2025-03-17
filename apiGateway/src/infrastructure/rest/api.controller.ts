//CONTROLLER

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GetStoricoUseCase } from '../../core/use-cases/get-storico.use-case';
import { GetRispostaUseCase } from '../../core/use-cases/get-risposta.use-case';
import { RequestChatCMD } from '../../core/domain/request-chat-cmd';
import { ReqAnswerCmd } from '../../core/domain/req-answer-cmd';
import { ChatDTO } from '../../core/domain/chat.dto';

@Controller('api')
export class ApiController {
  constructor(
    private readonly getStoricoUseCase: GetStoricoUseCase,
    private readonly getRispostaUseCase: GetRispostaUseCase,
  ) {}

  /**
   * Endpoint per recuperare la cronologia delle conversazioni.
   */
  @Get('get-storico/:id')
  async getStorico(@Param('id') id: string): Promise<any> {
    const req: RequestChatCMD = { id, numChat: 10 }; // !!! NUMCHAT DA CAMBIARE CON VARIABILE CHE ARRIVA DAL FRONTEND !!!
    const storico = await this.getStoricoUseCase.execute(req);

    console.log('STORICO DEBUG:', storico); //DEBUG !!!

    // Trasformazione dei dati per il frontend
    return storico.map((chat: ChatDTO) => ({
      id: chat.id,
      question: chat.question,
      answer: chat.answer,
      timestamp: chat.date ? new Date(chat.date).toISOString() : null, // DATE TYPE PROBLEM !!!
    }));
  }

  /**
   * Endpoint per ottenere una risposta dal chatbot.
   */
  @Post('get-risposta')
  async getRisposta(@Body() req: ReqAnswerCmd): Promise<any> {
    const risposta = await this.getRispostaUseCase.execute(req);

    console.log('RISPOSTA DEBUG:', risposta); // Log per verificare cosa arriva

    // Trasformazione dei dati per il frontend
    return {
      question: risposta.question,
      answer: risposta.answer,
      timestamp: risposta.date ? new Date(risposta.date).toISOString() : new Date().toISOString(), // Se non arriva una data, metti quella attuale
    };
  }
}
