import { InsertChatAdapter } from './insertChat.adapter';
import { InsertChatCmd } from '../../domain/insertChatCmd';
import { ChatRepository } from './persistence/chat.repository';
import { Chat } from 'src/domain/chat';
import { Message } from 'src/domain/message';

describe('InsertChatAdapter', () => {
  let adapter: InsertChatAdapter;
  let mockRepo: jest.Mocked<ChatRepository>;

  beforeEach(() => {
    mockRepo = { insertChat: jest.fn() } as any;
    adapter = new InsertChatAdapter(mockRepo);
  });

  it('should call ChatRepository.insertChat with correct arguments', async () => {
    // arrange
    const questionMessage = new Message('Q?', new Date().toISOString());
    const answerMessage = new Message('A!', new Date(Date.now() + 1000).toISOString());

    const cmd: InsertChatCmd = {
      question: questionMessage,
      answer: answerMessage
    };

    const mockChat = new Chat('abc', questionMessage, answerMessage, new Date().toISOString());
    mockRepo.insertChat.mockResolvedValue(mockChat);

    // act
    const result = await adapter.insertChat(cmd);

    // assert
    expect(mockRepo.insertChat).toHaveBeenCalledWith(
      questionMessage.content,
      answerMessage.content,
      new Date(questionMessage.timestamp)
    );

    expect(result.id).toEqual('abc');
    expect(result.question.content).toEqual(questionMessage.content);
    expect(result.question.timestamp).toEqual(questionMessage.timestamp);
    expect(result.answer.content).toEqual(answerMessage.content);
    expect(result.answer.timestamp).toEqual(answerMessage.timestamp);
  });
});
