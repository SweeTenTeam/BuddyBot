import { Injectable } from '@nestjs/common';
import { Chat } from '../../../domain/entities/chat.entity.js';
import { ReqAnswerCmd } from '../../../application/commands/request-answer.cmd.js';
import { LLMPort } from '../../../core/ports/llm.port.js';
import { Information } from 'src/domain/entities/information.entity.js';
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from '@langchain/core/output_parsers';
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatGroq } from "@langchain/groq";
import { Metadata } from 'src/domain/entities/metadata.entity.js';
import { Document } from 'node_modules/@langchain/core/dist/documents/document.js';


@Injectable()
export class GroqAdapter implements LLMPort {
  constructor(private readonly groq: ChatGroq) {
    
  }

  async generateAnswer(req: ReqAnswerCmd, info: Information[]): Promise<Chat> {
    //console.log("Information to pass to LLM: ") //uncomment this
    //console.log(info);
    const prompt = PromptTemplate.fromTemplate(`Answer the question based only on the following context: {context} Question: {question}`);
    const ragChain = await createStuffDocumentsChain({
        llm:this.groq,
        prompt,
        outputParser: new StringOutputParser(),
    });
    const documents: Document[] = [];
    for(const information of info){
      documents.push({pageContent: information.content, metadata: {'origin':information.metadata.origin,'type':information.metadata.type,'originId':information.metadata.originID}});
    }
    //todo get lenght and delete documents if too large
    const response = await ragChain.invoke({question: req.getText(), context: documents})
    return new Chat(req.getText(), response);
  }
}
