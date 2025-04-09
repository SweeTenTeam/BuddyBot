import { Repository } from "typeorm";
import { ChatRepository } from "./chat.repository"
import { ChatEntity } from "./chat-entity";
import { LastUpdateEntity } from "./lastFetch-entity";

describe('ChatRepository', () => {
  let chatRepository: ChatRepository;
  let mockChatRepo: jest.Mocked<Repository<ChatEntity>>;
  let mockLastUpdateRepo: jest.Mocked<Repository<LastUpdateEntity>>;

  beforeEach(() => {
    mockChatRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn()
    } as any;

    mockLastUpdateRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn()
    } as any;

    chatRepository = new ChatRepository(mockChatRepo, mockLastUpdateRepo);
  });

    it('should create a new chat using last fetch date from LastUpdateEntity', async () => {
    //arrange
    const questionContent = 'question?';
    const answerContent = 'answer!';
    const questionDate = new Date('2025-01-01T10:00:00Z');
    const lastFetchDate = new Date('2025-01-01T09:30:00Z');

    const mockLastUpdate = {
        id: 1,
        lastFetch: lastFetchDate
    };

    const mockChatEntity = {
        id: 'abc',
        question: questionContent,
        questionDate,
        answer: answerContent,
        answerDate: new Date('2025-01-01T10:00:22Z'),
        lastFetch: lastFetchDate.toISOString(),
    };

    mockLastUpdateRepo.findOne.mockResolvedValue(mockLastUpdate);
    mockChatRepo.create.mockReturnValue(mockChatEntity);
    mockChatRepo.save.mockResolvedValue(mockChatEntity);

    //act
    const result = await chatRepository.insertChat(questionContent, answerContent, questionDate);

    //assert
    expect(mockLastUpdateRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockChatRepo.create).toHaveBeenCalledWith({
        question: questionContent,
        questionDate,
        answer: answerContent,
        lastFetch: lastFetchDate.toISOString()
    });
    expect(mockChatRepo.save).toHaveBeenCalledWith(mockChatEntity);

    expect(result.id).toEqual('abc');
    expect(result.question).toEqual(questionContent);
    expect(result.questionDate.toISOString()).toEqual(questionDate.toISOString());
    expect(result.answer).toEqual(answerContent);
    expect(result.answerDate.toISOString()).toEqual(mockChatEntity.answerDate.toISOString());
    expect(result.lastFetch).toEqual(lastFetchDate.toISOString());
    });

    it('should fetch "N" chats when no lastChatId is provided', async () => {
        //arrange
        const mockChats = [
            {
            id: 'abe',
            question: 'question3?',
            questionDate: new Date('2025-01-03T10:00:00Z'),
            answer: 'answer3',
            answerDate: new Date('2025-01-03T10:01:00Z'),
            lastFetch: '2025-01-03T10:05:00Z',
            },
            {
            id: 'abd',
            question: 'question2?',
            questionDate: new Date('2025-01-02T10:00:00Z'),
            answer: 'answer2',
            answerDate: new Date('2025-01-02T10:01:00Z'),
            lastFetch: '2025-01-02T10:05:00Z',
            },
            {
            id: 'abc',
            question: 'question1?',
            questionDate: new Date('2025-01-01T10:00:00Z'),
            answer: 'answer1',
            answerDate: new Date('2025-01-01T10:01:00Z'),
            lastFetch: '2025-01-01T10:05:00Z',
            },
        ];

        mockChatRepo.find.mockResolvedValue(mockChats);

        //act
        const result = await chatRepository.fetchStoricoChat('');

        //assert
        expect(mockChatRepo.find).toHaveBeenCalledWith({
            order: { answerDate: 'DESC' },
            take: 5,
        });

        expect(result).toEqual(mockChats.slice().reverse());
    });

    it('should fetch chat history with a given lastChatId', async () => {
        //arrange
        const lastChat = {
            id: 'abf',
            question: 'question4?',
            questionDate: new Date('2025-01-04T10:00:00Z'),
            answer: 'answer4',
            answerDate: new Date('2025-01-04T10:01:00Z'),
            lastFetch: '2025-01-04T09:50:00Z',
        };

        const previousChats = [
            {
            id: 'abe',
            question: 'question3?',
            questionDate: new Date('2025-01-03T10:00:00Z'),
            answer: 'answer3',
            answerDate: new Date('2025-01-03T10:01:00Z'),
            lastFetch: '2025-01-03T09:50:00Z',
            },
            {
            id: 'abd',
            question: 'question2?',
            questionDate: new Date('2025-01-02T10:00:00Z'),
            answer: 'answer2',
            answerDate: new Date('2025-01-02T10:01:00Z'),
            lastFetch: '2025-01-02T09:50:00Z',
            },
            {
            id: 'abc',
            question: 'question1?',
            questionDate: new Date('2025-01-01T10:00:00Z'),
            answer: 'answer1',
            answerDate: new Date('2025-01-01T10:01:00Z'),
            lastFetch: '2025-01-01T09:50:00Z',
            },
        ];

        mockChatRepo.findOne.mockResolvedValue(lastChat);
        mockChatRepo.find.mockResolvedValue(previousChats);

        //act
        const result = await chatRepository.fetchStoricoChat('abf', 4);

        //assert
        expect(mockChatRepo.findOne).toHaveBeenCalledWith({ where: { id: 'abf' } });

        expect(mockChatRepo.find).toHaveBeenCalledWith({
            where: {
            answerDate: expect.any(Object),
            },
            order: { answerDate: 'DESC' },
            take: 4,
        });

        expect(result).toEqual(previousChats.slice().reverse());
    });

    it('should update existing LastUpdateEntity if it exists', async () => {
        //arrange
        const inputDate = '2025-04-01T09:50:00Z';
        const parsedDate = new Date(inputDate);

        const existingRecord = {
            id: 1,
            lastFetch: new Date('2025-03-31T09:50:00Z')
        };

        mockLastUpdateRepo.findOne.mockResolvedValue(existingRecord);
        mockLastUpdateRepo.save.mockResolvedValue({ ...existingRecord, lastFetch: parsedDate });

        //act
        const result = await chatRepository.insertLastRetrieval(inputDate);

        //assert
        expect(mockLastUpdateRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(existingRecord.lastFetch).toEqual(parsedDate);
        expect(mockLastUpdateRepo.save).toHaveBeenCalledWith(existingRecord);
        expect(result).toBe(true);
    });

    it('should create new LastUpdateEntity if none exists', async () => {
        //arrange
        const inputDate = '2025-04-01T09:50:00Z';
        const parsedDate = new Date(inputDate);

        mockLastUpdateRepo.findOne.mockResolvedValue(null);

        const newEntry = {
            id: 1,
            lastFetch: parsedDate,
        };

        mockLastUpdateRepo.create.mockReturnValue(newEntry);
        mockLastUpdateRepo.save.mockResolvedValue(newEntry);

        //act
        const result = await chatRepository.insertLastRetrieval(inputDate);

        //assert
        expect(mockLastUpdateRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(mockLastUpdateRepo.create).toHaveBeenCalledWith({ id: 1, lastFetch: parsedDate });
        expect(mockLastUpdateRepo.save).toHaveBeenCalledWith(newEntry);
        expect(result).toBe(true);
    });

    it('should fetch the last update record from the repository', async () => {
        //arrange
        const mockDate = new Date('2025-04-08T12:00:00Z');
        const mockEntity: LastUpdateEntity = {
            id: 1,
            lastFetch: mockDate,
        };

        mockLastUpdateRepo.findOne.mockResolvedValue(mockEntity);

        //act
        const result = await chatRepository.fetchLastUpdate();

        //assert
        expect(mockLastUpdateRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(result).toEqual(mockEntity);
    });

}); 