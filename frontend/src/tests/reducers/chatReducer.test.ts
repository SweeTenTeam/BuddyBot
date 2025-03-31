import { chatReducer } from "@/reducers/chatReducer";
import { ChatState } from "@/types/ChatState";
import { ChatAction } from "@/types/Action";
import { Message } from "@/types/Message";

describe("chatReducer", () => {
  let initialState: ChatState;

  beforeEach(() => {
    initialState = {
      messages: [],
      loadingHistory: false,
      errorHistory: false,
      hasMore: false,
      hasToScroll: false,
    };
  });

  it("should handle LOAD_HISTORY_START", () => {
    const action: ChatAction = { type: "LOAD_HISTORY_START" };
    const newState = chatReducer(initialState, action);
    expect(newState.loadingHistory).toBe(true);
    expect(newState.errorHistory).toBe(false);
    expect(newState.hasMore).toBe(false);
  });

  it("should handle LOAD_HISTORY_SUCCESS", () => {
    const action: ChatAction = { type: "LOAD_HISTORY_SUCCESS", payload: [{ id: "1", question: { content: "Q1", timestamp: new Date().toISOString() }, answer: {} as Message, error: false, loading: false }], hasMore: true };
    const newState = chatReducer(initialState, action);
    expect(newState.messages.length).toBe(1);
    expect(newState.loadingHistory).toBe(false);
    expect(newState.errorHistory).toBe(false);
    expect(newState.hasMore).toBe(true);
  });

  it("should handle LOAD_HISTORY_ERROR", () => {
    const action: ChatAction = { type: "LOAD_HISTORY_ERROR" };
    const newState = chatReducer(initialState, action);
    expect(newState.loadingHistory).toBe(false);
    expect(newState.errorHistory).toBe(true);
    expect(newState.hasMore).toBe(false);
  });

  it("should handle ADD_MESSAGE_START", () => {
    const action: ChatAction = { type: "ADD_MESSAGE_START", id: "1", question: { content: "Test question", timestamp: new Date().toISOString() } };
    const newState = chatReducer(initialState, action);
    expect(newState.messages.length).toBe(1);
    expect(newState.messages[0].loading).toBe(true);
  });

  it("should handle ADD_MESSAGE_SUCCESS", () => {
    const stateWithMessage = { ...initialState, messages: [{ id: "1", question: { content: "Q1", timestamp: new Date().toISOString() }, answer: {} as Message, loading: true, error: false }] };
    const action: ChatAction = { type: "ADD_MESSAGE_SUCCESS", id: "1", newid: "2", answer: {} as Message };
    const newState = chatReducer(stateWithMessage, action);
    expect(newState.messages[0].id).toBe("2");
    expect(newState.messages[0].loading).toBe(false);
    expect(newState.messages[0].error).toBe(false);
  });

  it("should handle ADD_MESSAGE_ERROR", () => {
    const stateWithMessage = { ...initialState, messages: [{ id: "1", question: { content: "Q1", timestamp: new Date().toISOString() }, answer: {} as Message, loading: true, error: false }] };
    const action: ChatAction = { type: "ADD_MESSAGE_ERROR", id: "1" };
    const newState = chatReducer(stateWithMessage, action);
    expect(newState.messages[0].loading).toBe(false);
    expect(newState.messages[0].error).toBe(true);
  });

  it("should handle SCROLL_DOWN", () => {
    const action: ChatAction = { type: "SCROLL_DOWN" };
    const newState = chatReducer(initialState, action);
    expect(newState.hasToScroll).toBe(true);
  });

  it('should not modify messages with non-matching ids on ADD_MESSAGE_SUCCESS and ADD_MESSAGE_ERROR', () => {
    const stateWithMessages = {
      ...initialState,
      messages: [
        { id: "1", question: { content: "Q1", timestamp: new Date().toISOString() }, answer: {} as Message, loading: true, error: false },
      ],
    };
  
    const actionSuccess: ChatAction = { type: "ADD_MESSAGE_SUCCESS", id: "2", newid: "3", answer: {} as Message };
    const actionError: ChatAction = { type: "ADD_MESSAGE_ERROR", id: "2" };
  
    const newStateSuccess = chatReducer(stateWithMessages, actionSuccess);
    const newStateError = chatReducer(stateWithMessages, actionError);
  
    expect(newStateSuccess.messages[0].id).toBe("1");
    expect(newStateError.messages[0].id).toBe("1");
  });

  it('should return state unchanged for unknown action types', () => {
    const action: ChatAction = { type: "UNKNOWN_ACTION" as any};
  
    const newState = chatReducer(initialState, action);
  
    // Verifica che lo stato non sia cambiato
    expect(newState).toEqual(initialState);
  });
  
});
