import { Injectable } from "@nestjs/common";
import { QdrantVectorStore } from "@langchain/qdrant";
import { InformationEntity } from "./entities/information.entity";


@Injectable()
export class QdrantInformationRepository {

  constructor(private readonly vectorStore: QdrantVectorStore) {
  }

  async storeInformation(infoToStore: InformationEntity): Promise<boolean> {
    try {
      await this.vectorStore.addDocuments([
        {
          pageContent: infoToStore.content,
          metadata: {
            origin: infoToStore.metadata.origin,
            type: infoToStore.metadata.type,
            originID: infoToStore.metadata.originID,
          },
        },
      ]);
      return true;
    } catch (error) {
      console.error("Error storing information:", error);
      return false;
    }
  }

  async retrieveRelevantInfo(query: string): Promise<InformationEntity[]> {
    try {
      const results = await this.vectorStore.similaritySearch(query, 5);

      return results.map(
        (res) =>
          new InformationEntity(res.pageContent, {
            origin: res.metadata.origin,
            type: res.metadata.type,
            originID: res.metadata.originID,
          })
      );
    } catch (error) {
      console.error("Error retrieving relevant info:", error);
      return [];
    }
  }

}
