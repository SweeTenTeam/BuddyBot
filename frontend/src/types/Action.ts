import { Message } from "@/types/Message";
import { QuestionAnswer } from "./QuestionAnswer";

export type ChatAction =
  | { type: "LOAD_HISTORY_START" }
  | { type: "LOAD_HISTORY_SUCCESS"; payload: QuestionAnswer[], hasMore: boolean }
  | { type: "LOAD_HISTORY_ERROR", error: number }
  | { type: "ADD_MESSAGE_START"; id: string, question: Message }
  | { type: "ADD_MESSAGE_SUCCESS"; id: string, answer: Message, newid: string }
  | { type: "ADD_MESSAGE_ERROR"; id: string, error: number }
  | { type: "SCROLL_DOWN" };