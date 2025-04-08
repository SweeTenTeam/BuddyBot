import { FetchHistoryAdapter } from './fetchHistory.adapter';
import { ChatRepository } from './persistence/chat.repository';
import { FetchHistoryCmd } from 'src/domain/fetchHistoryCmd';
import { Chat } from 'src/domain/chat';
import { Message } from 'src/domain/message';

describe('FetchHistoryAdapter', () => {
  let adapter: FetchHistoryAdapter;
  let mockRepo: jest.Mocked<ChatRepository>;

  beforeEach(() => {
    mockRepo = {
      fetchStoricoChat: jest.fn(),
    } as any;

    adapter = new FetchHistoryAdapter(mockRepo);
  });

  it('should fetch chat history and map it to Chat domain objects', async () => {
    //arrange
    const fetchCmd: FetchHistoryCmd = {
      id: 'abc1',
      numChat: 2,
    };

    const mockEntities = [
      {
        id: 'abc1',
        question: 'Quest 1',
        questionDate: new Date('2025-01-01T10:00:00Z'),
        answer: 'Answer 1',
        answerDate: new Date('2025-01-01T10:01:00Z'),
        lastFetch: new Date('2025-01-01T10:05:00Z').toISOString(),
      },
      {
        id: 'abc2',
        question: 'Quest 2',
        questionDate: new Date('2025-01-02T10:00:00Z'),
        answer: 'Answer 2',
        answerDate: new Date('2025-01-02T10:01:00Z'),
        lastFetch: new Date('2025-01-02T10:05:00Z').toISOString(),
      },
    ];

    mockRepo.fetchStoricoChat.mockResolvedValue(mockEntities);

    //act
    const result = await adapter.fetchStoricoChat(fetchCmd);

    //assert
    expect(mockRepo.fetchStoricoChat).toHaveBeenCalledWith(fetchCmd.id, fetchCmd.numChat);
    expect(result).toHaveLength(mockEntities.length);

    for (let i = 0; i < result.length; i++) {
      const expected = mockEntities[i];
      const actual = result[i];

      expect(actual).toBeInstanceOf(Chat);
      expect(actual.id).toEqual(expected.id);
      expect(actual.question.content).toEqual(expected.question);
      expect(actual.question.timestamp).toEqual(expected.questionDate.toISOString());
      expect(actual.answer.content).toEqual(expected.answer);
      expect(actual.answer.timestamp).toEqual(expected.answerDate.toISOString());
      expect(actual.lastFetch).toEqual(expected.lastFetch); // nuova asserzione
    }
  });
});
