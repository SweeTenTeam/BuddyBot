import { QuestionAnswer } from "@/types/QuestionAnswer";
import { Message } from "@/types/Message";

export interface Target {
  requestHistory(id: string, offset: number): Promise<QuestionAnswer[]>;
  requestAnswer(question: Message): Promise<{answer: Message, id: string, lastUpdated: string}>;
}