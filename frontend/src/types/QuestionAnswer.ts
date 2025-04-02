import { Message } from "./Message";

export interface QuestionAnswer {
    id: string;
    question: Message;
    answer: Message;
    error: number;
    loading: boolean;
    lastUpdated: string;
}
