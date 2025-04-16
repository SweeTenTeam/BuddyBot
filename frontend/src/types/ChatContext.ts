import { createContext } from "react";
import { ChatAction } from "./Action";
import { ChatState } from "./ChatState";

export interface ChatContext {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  loadHistory: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
}

export const ChatContext = createContext<ChatContext | undefined>(undefined);