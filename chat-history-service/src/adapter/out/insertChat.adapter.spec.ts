import { InsertChatAdapter } from './insertChat.adapter';
import { InsertChatCmd } from '../../domain/insertChatCmd';
import { ChatRepository } from './persistence/chat.repository';
import { Chat } from 'src/domain/chat';

describe('InsertChatAdapter', () => {
  let adapter: InsertChatAdapter;
  let mockRepo: jest.Mocked<ChatRepository>;

  beforeEach(() => {
    mockRepo = { insertChat: jest.fn() } as any;
    adapter = new InsertChatAdapter(mockRepo);
  });

  it('should call ChatRepository.insertChat with correct args', async () => {
    const cmd: InsertChatCmd = {
      question: 'Q?',
      answer: 'A!',
      date: new Date(),
    };
    const mockChat: Chat = {
      id: 'abc',
      question: cmd.question,
      answer: cmd.answer,
      questionDate: cmd.date,
      answerDate: new Date()
    }
    mockRepo.insertChat.mockResolvedValue(mockChat);

    const result = await adapter.insertChat(cmd);

    expect(mockRepo.insertChat).toHaveBeenCalledWith(
      cmd.question,
      cmd.answer,
      cmd.date,
    );
    expect(result).toBe(mockChat);
  });
});