import { QuestionAnswer } from "@/types/QuestionAnswer";
import { Message } from "@/types/Message";
import { Target } from "./Target";
import { AdapterFacade } from "./AdapterFacade";
import { generateId } from "@/utils/generateId";

export class Adapter implements Target {
    private adapterFacade: AdapterFacade;

    constructor() {
        this.adapterFacade = new AdapterFacade();
    }

    async requestHistory(id: string, offset: number): Promise<QuestionAnswer[]> {
        try {
            const jsonResponse = await this.adapterFacade.fetchHistory(id, offset);
            return this.adaptQuestionAnswerArray(jsonResponse);
        } catch (error) {
            throw new Error("Error fetching history");
        }
    }
    async requestAnswer(question: Message): Promise<{ answer: Message; id: string; }> {
        try {
            const answer = await this.adapterFacade.fetchQuestion(this.adaptMessageToJSON(question));
            return {
                answer: this.adaptMessage(answer.answer),
                id: answer.id
            };
        } catch (error) {
            throw new Error("Error fetching history");
        }
    }

    private adaptMessage(data: any): Message {
        return {
            content: data.content,
            timestamp: data.timestamp,
        };
    };

    private adaptQuestionAnswer(data: any): QuestionAnswer {
        return {
            id: data.id || generateId(),
            question: this.adaptMessage(data.question),
            answer: this.adaptMessage(data.answer),
            error: data.error || false,
            loading: data.loading || false,
        };
    };

    private adaptQuestionAnswerArray(dataArray: any[]): QuestionAnswer[] {
        return dataArray.map(data => this.adaptQuestionAnswer(data));
    };

    private adaptMessageToJSON(question: Message): any {
        return {
            text: question.content,
            date: question.timestamp,
        };
    };
}