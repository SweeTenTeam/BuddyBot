import { InsertChatAdapter } from './insertChat.adapter';
import { InsertChatCmd } from '../../domain/insertChatCmd';
import { ChatRepository } from './persistence/chat.repository';
import { Message } from 'src/domain/message';

describe('InsertChatAdapter', () => {
  let adapter: InsertChatAdapter;
  let mockRepo: jest.Mocked<ChatRepository>;

  beforeEach(() => {
    mockRepo = { insertChat: jest.fn() } as any;
    adapter = new InsertChatAdapter(mockRepo);
  });

  it('should call ChatRepository.insertChat with correct arguments and return mapped Chat domain object', async () => {
    //arrange
    const questionTimestamp = new Date('2025-01-01T10:00:00Z');
    const answerTimestamp = new Date('2025-01-01T10:01:00Z');
    const lastFetchTimestamp = '2025-01-01T09:55:00Z';

    const questionMessage = new Message('Q?', questionTimestamp.toISOString());
    const answerMessage = new Message('A!', answerTimestamp.toISOString());

    const cmd: InsertChatCmd = {
      question: questionMessage,
      answer: answerMessage,
    };

    const mockChatEntity = {
      id: 'abc',
      question: questionMessage.content,
      questionDate: questionTimestamp,
      answer: answerMessage.content,
      answerDate: answerTimestamp,
      lastFetch: lastFetchTimestamp,
    };

    mockRepo.insertChat.mockResolvedValue(mockChatEntity);

    //act
    const result = await adapter.insertChat(cmd);

    //assert
    expect(mockRepo.insertChat).toHaveBeenCalledWith(
      questionMessage.content,
      answerMessage.content,
      new Date(questionMessage.timestamp)
    );

    expect(result.id).toEqual('abc');
    expect(result.question.content).toEqual('Q?');
    expect(result.question.timestamp).toEqual(questionTimestamp.toISOString());
    expect(result.answer.content).toEqual('A!');
    expect(result.answer.timestamp).toEqual(answerTimestamp.toISOString());
    expect(result.lastFetch).toEqual(lastFetchTimestamp);
  });
});
