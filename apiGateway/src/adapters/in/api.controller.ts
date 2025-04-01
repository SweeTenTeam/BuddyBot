import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { RequestChatDTO } from './dtos/request-chat.dto';
import { ReqAnswerDTO } from './dtos/req-answer.dto';
import { ChatDTO } from './dtos/chat.dto';
import { Injectable, Inject } from '@nestjs/common';
import { GetChatUseCase } from '../../application/ports/in/get-chat';
import { GetStoricoUseCase } from '../../application/ports/in/get-storico';
import { timestamp } from 'rxjs';



@Controller('api')
export class ApiController {

  constructor(
      @Inject('GetChatUseCase') private readonly GetRispostaService: GetChatUseCase,
      @Inject('GetStoricoUseCase') private readonly GetStoricoService: GetStoricoUseCase, 
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
    const storico = await this.GetStoricoService.execute(req);
  
    /***/
    
    const result: ChatDTO[] = [];
    for(let i=0; i<storico.length; i++){
      result.push(new ChatDTO(storico[i].id,storico[i].question,storico[i].answer));
    }

    return result;
  }

  /**
   * Endpoint per ottenere una risposta dal chatbot.
   */
  @Post('get-risposta')
  async getRisposta(@Body('text') text: string, @Body('timestamp') timestamp: string): Promise<ChatDTO> {
  
    const chatSalvata = await this.GetRispostaService.execute(new ReqAnswerDTO(text, timestamp || new Date().toISOString()));
    console.log(chatSalvata);

    /***/
    
    console.log('Risposta finale per il frontend:', chatSalvata);
  
    return new ChatDTO(chatSalvata.id,chatSalvata.question,chatSalvata.answer);
  }
}