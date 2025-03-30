//CONTROLLER
import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { GetStoricoUseCase } from '../../core/services/get-storico.use-case';
import { GetRispostaUseCase } from '../../core/services/get-risposta.use-case';
import { RequestChatDTO } from '../../core/domain/request-chat.dto';
import { ReqAnswerDTO } from '../../core/domain/req-answer.dto';
import { ChatDTO } from '../../core/domain/chat.dto';
import { Chat } from 'src/core/domain/chat';
import { ReqAnswerCmd } from 'src/core/domain/req-answer-cmd';

@Controller('api')
export class ApiController {
  constructor(
    private readonly getStoricoUseCase: GetStoricoUseCase,
    private readonly getRispostaUseCase: GetRispostaUseCase,
  ) {}

  /**
   * Endpoint per recuperare la cronologia delle conversazioni.
   */
  @Get('get-storico')
  async getStorico(
    @Query('id') id?: string,
    @Query('num') numChat?: number 
  ): Promise<ChatDTO[]> {
    const req: RequestChatDTO = new RequestChatDTO(id ?? '',numChat ?? 1) // valore 1 di default, almeno una chat 
    const storico = await this.getStoricoUseCase.execute(req);
  
    //console.log('STORICO DEBUG:', storico); // Debug !!!
  
    //if (!Array.isArray(storico)) {
      //throw new Error("La risposta del microservizio storico non è un array.");
    //}

    if (!Array.isArray(storico) || storico.some(chat => !chat.question || !chat.answer)) {
      throw new Error("La risposta del microservizio storico non è valida.");
    }
    
    const result: ChatDTO[] = [];
    for(let i=0; i<storico.length; i++){
      result.push(new ChatDTO(storico[i].id,storico[i].question,storico[i].answer));
    }

    return result;

    // Trasformazione per il frontend seguendo oggetto ChatDTO
    //return storico.map((chat) => ({
    //  id: chat.id,
    //  question: {
    //    content: chat.question.content,
    //    timestamp: chat.question.timestamp,
    //  },
    //  answer: {
    //    content: chat.answer.content,
    //    timestamp: chat.answer.timestamp,
    //  },
    //}));
  }

  /**
   * Endpoint per ottenere una risposta dal chatbot.
   */
  @Post('get-risposta')
  async getRisposta(@Body('text') text: string): Promise<ChatDTO> {
    //const requestWithDate: ReqAnswerDTO = {
    //  text: req.text,
    //  date: req.date || new Date().toISOString(),
    //};
    // why?

    const chatSalvata = await this.getRispostaUseCase.execute(new ReqAnswerCmd(text,new Date().toISOString()));
    console.log(chatSalvata);
    //!!!
    if (!chatSalvata || !chatSalvata.question || !chatSalvata.answer) {
      throw new Error("Risposta non valida dal microservizio.");
    }
    
    console.log('Risposta finale per il frontend:', chatSalvata);
  
    return new ChatDTO(chatSalvata.id,chatSalvata.question,chatSalvata.answer);

    //return {
    //  id: chatSalvata.id,
    //  question: {
    //    content: chatSalvata.question.content,
    //    timestamp: chatSalvata.question.timestamp,
    //  },
    //  answer: {
    //    content: chatSalvata.answer.content,
    //    timestamp: chatSalvata.answer.timestamp,
    //  },
    //};
  }
}