//CONTROLLER
import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { GetStoricoService } from '../../application/services/storico-message.service';
import { GetRispostaService } from '../../application/services/chatbot-message.service';
import { RequestChatDTO } from './dtos/request-chat.dto';
import { ReqAnswerDTO } from './dtos/req-answer.dto';
import { ChatDTO } from './dtos/chat.dto';

//import { GetChatUseCase } from '../../application/ports/in/get-chat';
//import { GetStoricoUseCase } from '../../application/ports/in/get-storico';



@Controller('api')
export class ApiController {
  constructor(
    private readonly GetStoricoService: GetStoricoService,
    private readonly GetRispostaService: GetRispostaService,
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
  
    //console.log('STORICO DEBUG:', storico); // Debug !!!

    if (!Array.isArray(storico) || storico.some(chat => !chat.question || !chat.answer)) {
      throw new Error("NON é STATO RITORNATO UN ARRAY DI CHAT.");
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

    const chatSalvata = await this.GetRispostaService.execute(new ReqAnswerDTO(text,new Date().toISOString()));
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