import { QuestionAnswer } from "./QuestionAnswer";

export interface ChatState {
  messages: QuestionAnswer[];
  loadingHistory: boolean;
  errorHistory: boolean;
  hasMore: boolean;
  hasToScroll: boolean;
}

export const initialState: ChatState = {
  messages: [],
  loadingHistory: true,
  errorHistory: false,
  hasMore: false,
  hasToScroll: false,
};
