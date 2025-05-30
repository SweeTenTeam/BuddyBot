import { Injectable, Logger } from "@nestjs/common";
import { QdrantVectorStore } from "@langchain/qdrant";
import { InformationEntity } from "./entities/information.entity.js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { MetadataEntity } from "./entities/metadata.entity.js";
import { Information } from "../../../domain/business/information.js";
import { Metadata } from "../../../domain/business/metadata.js";
import { Result } from "../../../domain/business/Result.js";
import { Origin, Type } from "../../../domain/shared/enums.js";

@Injectable()
export class QdrantInformationRepository {

  constructor(private readonly vectorStore: QdrantVectorStore, private readonly textSplitter: RecursiveCharacterTextSplitter ) {}


  async storeInformation(infoToStore: Information): Promise<Result> {
    try {
      // First, delete any existing documents with the same metadata combination
      console.log('Attempting to delete existing documents with same metadata...');
      await this.deleteByMetadata({
        origin: infoToStore.metadata.origin,
        type: infoToStore.metadata.type,
        originID: infoToStore.metadata.originID
      });
      
      
      let documents: Document[] = [];
      console.log("docs size: "+ infoToStore.content.length)
      if (infoToStore.content.length > 10000) {
        const splitDocs = await this.splitDocuments([{ pageContent: infoToStore.content }]);
        
        documents = splitDocs.map(doc => ({
          pageContent: doc.pageContent,
          metadata: {
            origin: infoToStore.metadata.origin as Origin,
            type: infoToStore.metadata.type as Type,
            originID: infoToStore.metadata.originID,
          }
        }));
        console.log(`Split into ${documents.length} documents`);
      } else {
        documents = [{
          pageContent: infoToStore.content,
          metadata: {
            origin: infoToStore.metadata.origin as Origin,
            type: infoToStore.metadata.type as Type,
            originID: infoToStore.metadata.originID,
          }
        }];
      }

      // logic for batching, needs to be 1 cause of restriction of free tier
      const batchSize = 1;
      for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);
        await this.vectorStore.addDocuments(batch);
        console.log(`Added batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(documents.length/batchSize)}`);
      }
      console.log(`Successfully stored information with ID ${infoToStore.metadata.originID}, created ${documents.length} document(s)`);
      return Result.ok();

    } catch (error) {
      console.error('Detailed error in storeInformation:', {
        error: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code
      });
      return Result.fromError(error);
    }
  }

  async retrieveRelevantInfo(query: string, limit = 30): Promise<InformationEntity[]> {
    try {
      const results = await this.similaritySearch(query, limit);
      
      return results.map(res => {
        const metadata = new MetadataEntity(
          res.metadata.origin as Origin,
          res.metadata.type as Type,
          res.metadata.originID
        );
        return new InformationEntity(res.pageContent, metadata);
      });
    } catch (error) {
      Logger.error(`Error retrieving relevant info: ${error.message}`, error.stack);
      throw error;
    }
  }

  async splitDocuments(documents: { pageContent: string }[]): Promise<Document[]> {
    // try {
      const splitDocs = await this.textSplitter.createDocuments(
        documents.map(doc => doc.pageContent)
      );
      return splitDocs;
    // } catch (error) {
    //   console.error(`Error splitting documents: ${error}`);
    //   throw error;
    // }


  }

  async similaritySearch(query: string, k = 10): Promise<Document[]> {
    // try {
      const retriever = this.vectorStore.asRetriever(k);
      const results = await retriever.invoke(query);
      
      console.debug(`Similarity search found ${results.length} results for query: ${query}`);
      return results;
    // } catch (error) {
    //   console.error(`Error performing similarity search: ${error}`);
    //   throw error;
    // }
  }


  async deleteByMetadata(metadata: Metadata): Promise<Result> {
    try {
      const client = this.vectorStore.client;
      const collectionName = this.vectorStore.collectionName;
      
      const filter = {
        must: [
          {
            key: 'metadata.origin',
            match: { value: metadata.origin as Origin },
          },
          {
            key: 'metadata.type',
            match: { value: metadata.type as Type },
          },
          {
            key: 'metadata.originID',
            match: { value: metadata.originID },
          },
        ],
      };
      
      await client.delete(collectionName, { filter });
      
      console.log(`Successfully deleted documents with metadata combination: ${JSON.stringify(metadata)}`);
      return Result.ok();
    } catch (error) {
      console.error('Detailed error in deleteByMetadata:', {
        error: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code
      });
      return Result.fromError(error);
    }
  }
}