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
    const prompt = PromptTemplate.fromTemplate('Rispondi alla domanda in italiano e formattandola in markdown con informazioni leggibili da esseri umani basandoti solo sul seguente contesto avvisando se la domanda non è pertinente al contesto: {context} Domanda: {question}');
    const ragChain = await createStuffDocumentsChain({
        llm:this.groq,
        prompt,
        outputParser: new StringOutputParser(),
    });
    const documents: Document[] = [];
    for(const information of info){
      documents.push({
        pageContent: information.content, 
        metadata: {
          'origin': information.metadata.origin,
          'type': information.metadata.type,
          'originId': information.metadata.originID
        }
      });
    }

    const TOKEN_LIMIT = 6000;
    const CHARS_PER_TOKEN = 4;
    const queryTokens = Math.ceil(req.getText().length / CHARS_PER_TOKEN);
    const promptTemplateTokens = Math.ceil(prompt.template.length / CHARS_PER_TOKEN);
    
    let totalDocTokens = 0;
    const filteredDocuments: Document[] = [];
    
    for (const doc of documents) {
      const docTokens = Math.ceil(doc.pageContent.length / CHARS_PER_TOKEN);
      if (totalDocTokens + docTokens + queryTokens + promptTemplateTokens <= TOKEN_LIMIT) {
        totalDocTokens += docTokens;
        filteredDocuments.push(doc);
      } else {
        console.log(`Skipping document that would exceed token limit. Current tokens: ${totalDocTokens}, Document tokens: ${docTokens}`);
        break;
      }
    }

    console.log(`Using ${filteredDocuments.length} out of ${documents.length} documents. Estimated tokens: ${totalDocTokens + queryTokens + promptTemplateTokens}`);
    
    const response = await ragChain.invoke({
      question: req.getText(), 
      context: filteredDocuments
    });
    
    return new Chat(req.getText(), response);
  }
}
