import { Message } from "@/types/Message";
import { ChatState } from "@/types/ChatState";
import { ChatAction } from "@/types/Action";

export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "LOAD_HISTORY_START":
      return { 
        ...state, 
        loadingHistory: true,
        errorHistory: false,
        hasMore: false,
      };
    case "LOAD_HISTORY_SUCCESS":
      return {
        ...state,
        messages: [...action.payload, ...state.messages],
        loadingHistory: false,
        errorHistory: false,
        hasMore: action.hasMore,
      };
    case "LOAD_HISTORY_ERROR":
      return {
        ...state,
        loadingHistory: false,
        errorHistory: true,
        hasMore: false,
      };
    case "ADD_MESSAGE_START":
      return { 
        ...state, 
        messages: [...state.messages, { id: action.id, question: action.question, answer: {} as Message, error: false, loading: true }],
      };
    case "ADD_MESSAGE_SUCCESS":
      const updatedMessagesSuccess = state.messages.map((msg) => {
        if (msg.id === action.id) {
          return {
            ...msg,
            id: action.newid,
            answer: action.answer,
            loading: false,
            error: false,
          };
        }
        return msg;
      });
      return { 
        ...state, 
        messages: updatedMessagesSuccess,
      };
    case "ADD_MESSAGE_ERROR":
      const updatedMessagesError = state.messages.map((msg) => {
        if (msg.id === action.id) {
          return {
            ...msg,
            loading: false,
            error: true,
          };
        }
        return msg;
      });
      return { 
        ...state, 
        messages: updatedMessagesError,
      };
    case "SCROLL_DOWN":
    return {
      ...state,
      hasToScroll: !state.hasToScroll,
    };
    default:
      return state;
  }
};
