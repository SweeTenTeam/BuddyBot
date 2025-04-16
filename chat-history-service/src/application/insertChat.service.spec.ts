import { InsertChatCmd } from "src/domain/insertChatCmd";
import { InsertChatService } from "./insertChat.service";
import { InsertChatPort } from "./port/out/insertChat.port";
import { Message } from "src/domain/message";
import { Chat } from "src/domain/chat";

describe('InsertChatService', () => {
  let service: InsertChatService;
  let mockInsertChatPort: jest.Mocked<InsertChatPort>;

  beforeEach(() => {
    mockInsertChatPort = {
      insertChat: jest.fn(),
    };
    service = new InsertChatService(mockInsertChatPort);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call InsertChatAdapter.insertChat with correct parameters', async () => {
    //arrange
    const questionMessage = new Message("What's your name?", new Date().toISOString());
    const answerMessage = new Message("My name is Mario Rossi", new Date(Date.now() + 1000).toISOString());

    const cmdMock: InsertChatCmd = {
      question: questionMessage,
      answer: answerMessage
    };

    const expectedChat = new Chat("abc", questionMessage, answerMessage, new Date().toISOString());
    mockInsertChatPort.insertChat.mockResolvedValue(expectedChat);

    //act
    const result = await service.insertChat(cmdMock);

    //assert
    expect(mockInsertChatPort.insertChat).toHaveBeenCalledWith(cmdMock);
    expect(result).toEqual(expectedChat);
  });
});
