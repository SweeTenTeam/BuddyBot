import { Injectable, Logger } from "@nestjs/common";
import { QdrantVectorStore } from "@langchain/qdrant";
import { InformationEntity } from "./entities/information.entity.js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { MetadataEntity } from "./entities/metadata.entity.js";
import { Information } from "../../../domain/business/information.js";
import { Metadata } from "../../../domain/business/metadata.js";

@Injectable()
export class QdrantInformationRepository {

  constructor(private readonly vectorStore: QdrantVectorStore, private readonly textSplitter: RecursiveCharacterTextSplitter ) {}


  async storeInformation(infoToStore: Information): Promise<boolean> {
    try {
      // First, delete any existing documents with the same metadata combination
      await this.deleteByMetadata({
        origin: infoToStore.metadata.origin,
        type: infoToStore.metadata.type,
        originID: infoToStore.metadata.originID
      });
      
      let documents: Document[] = [];
      
      if (infoToStore.content.length > 1000) {
        const splitDocs = await this.splitDocuments([{ pageContent: infoToStore.content }]);
        
        documents = splitDocs.map(doc => ({
          pageContent: doc.pageContent,
          metadata: {
            origin: infoToStore.metadata.origin,
            type: infoToStore.metadata.type,
            originID: infoToStore.metadata.originID,
          }
        }));
      } else {
        documents = [{
          pageContent: infoToStore.content,
          metadata: {
            origin: infoToStore.metadata.origin,
            type: infoToStore.metadata.type,
            originID: infoToStore.metadata.originID,
          }
        }];
      }
      
      await this.vectorStore.addDocuments(documents);
      console.log(`Successfully stored information with ID ${infoToStore.metadata.originID}, created ${documents.length} document(s)`);
      return true;
    } catch (error) {
      console.error(`Error storing information: ${error}`);
      return false;
    }
  }

  async retrieveRelevantInfo(query: string, limit = 10): Promise<InformationEntity[]> {
    try {
      const results = await this.similaritySearch(query, limit);
      
      return results.map(res => {
        return new InformationEntity(res.pageContent, {
          origin: res.metadata.origin,
          type: res.metadata.type,
          originID: res.metadata.originID
        });
      });
    } catch (error) {
      return [];
    }
  }

  async splitDocuments(documents: { pageContent: string }[]): Promise<Document[]> {
    try {
      const splitDocs = await this.textSplitter.createDocuments(
        documents.map(doc => doc.pageContent)
      );
      return splitDocs;
    } catch (error) {
      console.error(`Error splitting documents: ${error}`);
      throw error;
    }
  }

  async similaritySearch(query: string, k = 10): Promise<Document[]> {
    try {
      const retriever = this.vectorStore.asRetriever(k);
      const results = await retriever.invoke(query);
      
      console.debug(`Similarity search found ${results.length} results for query: ${query}`);
      return results;
    } catch (error) {
      console.error(`Error performing similarity search: ${error}`);
      throw error;
    }
  }


  async deleteByMetadata(metadata: Metadata): Promise<boolean> {
    try {
      const client = this.vectorStore.client;
      const collectionName = this.vectorStore.collectionName;
      
      const filter = {
        must: [
          {
            key: 'metadata.origin',
            match: { value: metadata.origin },
          },
          {
            key: 'metadata.type',
            match: { value: metadata.type },
          },
          {
            key: 'metadata.originID',
            match: { value: metadata.originID },
          },
        ],
      };
      
      await client.delete(collectionName, { filter });
      
      console.log(`Successfully deleted documents with metadata combination: ${JSON.stringify(metadata)}`);
      return true;
    } catch (error) {
      console.error(`Error deleting documents by metadata: ${error}`);
      return false;
    }
  }
}