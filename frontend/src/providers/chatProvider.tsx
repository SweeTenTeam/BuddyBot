import React from "react";
import { useContext, useReducer, useEffect } from "react";
import { chatReducer } from "@/reducers/chatReducer";
import { initialState } from "@/types/ChatState";
import { Message } from "@/types/Message";
import { QuestionAnswer } from "@/types/QuestionAnswer";
import { generateId } from "@/utils/generateId";
import { ChatContext } from "@/types/ChatContext";
import { ChatProviderProps } from "@/types/ChatProviderProps";
import { CustomError } from "@/types/CustomError";

export const ChatProvider = ({ children, adapter }: ChatProviderProps) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const loadHistory = async (): Promise<void> => {
    dispatch({ type: "LOAD_HISTORY_START" });
    try {
      if (state.messages.length === 0) {
        const olderMessages: QuestionAnswer[] = await adapter.requestHistory("", 10);
        for (let i = 0; i < olderMessages.length; i++) {
          if (olderMessages[i].answer.content.length > 100000) {
            olderMessages[i].error = 1;
          }
        }
        dispatch({ type: "LOAD_HISTORY_SUCCESS", payload: olderMessages, hasMore: !(olderMessages.length < 10) });
        dispatch({ type: "SCROLL_DOWN" });
      }
      else {
        const olderMessages: QuestionAnswer[] = await adapter.requestHistory(state.messages[0].id, 10);
        dispatch({ type: "LOAD_HISTORY_SUCCESS", payload: olderMessages, hasMore: !(olderMessages.length < 10) });
      }
    }
    catch (error) {
      if (error instanceof CustomError) dispatch({ type: "LOAD_HISTORY_ERROR" , error: error.code});
      else dispatch({ type: "LOAD_HISTORY_ERROR" , error: 500});
    }
  };

  const sendMessage = async (text: string) => {
    const id = generateId();
    const newMessage: Message = {
      content: text,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: "ADD_MESSAGE_START", id: id, question: newMessage });
    dispatch({ type: "SCROLL_DOWN" });
    try {
      const botResponse: { answer: Message, id: string, lastUpdated: string } = await adapter.requestAnswer(newMessage);
      if(botResponse.answer.content.length > 100000) dispatch({ type: "ADD_MESSAGE_ERROR", id: id, error: 1 });
      else dispatch({ type: "ADD_MESSAGE_SUCCESS", id: id, answer: botResponse.answer, newid: botResponse.id, lastUpdated: botResponse.lastUpdated });
    }
    catch (error) {
      if (error instanceof CustomError) dispatch({ type: "ADD_MESSAGE_ERROR", id: id, error: error.code });
      else dispatch({ type: "ADD_MESSAGE_ERROR", id: id, error: 501 });
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <ChatContext.Provider value={{ state, dispatch, loadHistory, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook per usare il contesto
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
