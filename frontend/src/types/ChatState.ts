import { QuestionAnswer } from "./QuestionAnswer";

export interface ChatState {
  messages: QuestionAnswer[];
  loadingHistory: boolean;
  errorHistory: number;
  hasMore: boolean;
  hasToScroll: boolean;
}

export const initialState: ChatState = {
  messages: [],
  loadingHistory: true,
  errorHistory: 0,
  hasMore: false,
  hasToScroll: false,
};
