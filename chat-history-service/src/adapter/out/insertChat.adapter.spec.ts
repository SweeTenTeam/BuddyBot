import { InsertChatAdapter } from './insertChat.adapter';
import { InsertChatCmd } from '../../domain/insertChatCmd';
import { ChatRepository } from './persistence/chat.repository';

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
    mockRepo.insertChat.mockResolvedValue(true);

    const result = await adapter.insertChat(cmd);

    expect(mockRepo.insertChat).toHaveBeenCalledWith(
      cmd.question,
      cmd.answer,
      cmd.date,
    );
    expect(result).toBe(true);
  });
});