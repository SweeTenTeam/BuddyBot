import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Chat } from '../../../domain/entities/chat.entity';
import { ReqAnswerCmd } from '../../../application/commands/request-answer.cmd';
import { LLMPort } from '../../../core/ports/llm.port';
import { Groq } from 'groq-sdk';
import { Information } from 'src/domain/entities/information.entity';
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from '@langchain/core/dist/output_parsers';
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatGroq } from "@langchain/groq";


@Injectable()
export class GroqAdapter implements LLMPort {
  constructor(private readonly groq: ChatGroq) {
    
  }

  async generateAnswer(req: ReqAnswerCmd, info: Information[]): Promise<Chat> {
    const prompt = PromptTemplate.fromTemplate(`Answer the question based only on the following context: {context} Question: {question}`);
        const ragChain = await createStuffDocumentsChain({
            llm:this.groq,
            prompt,
            outputParser: new StringOutputParser(),
          });
          const response = await ragChain.invoke({question:req.getText(), context:info})
    return new Chat(req.getText(), response);
  }
}
