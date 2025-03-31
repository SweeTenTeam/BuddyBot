import { Repository } from "typeorm";
import { ChatRepository } from "./chat.repository"
import { ChatEntity } from "./chat-entity";

describe('ChatRepository', () => {
    let chatRepository: ChatRepository;
    let mockRepo: jest.Mocked<Repository<ChatEntity>>;

    beforeEach(() =>{
        mockRepo = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn()
        } as any
        chatRepository = new ChatRepository(mockRepo)
    });

    it('should create a new chat', async () => {
        //arrange
        const id = 'abc'
        const questionContent = 'question?'
        const answerContent = 'answer'
        const questionDate = new Date()
        const answerDate = new Date()
        answerDate.setHours(answerDate.getHours()+1)
        const mockChat = { id, question: questionContent, answer: answerContent, answerDate, questionDate }

        mockRepo.create.mockReturnValue( mockChat )

        //act
        const result = await chatRepository.insertChat(questionContent, answerContent, questionDate)

        //assert
        expect(mockRepo.create).toHaveBeenCalledWith({ question: questionContent, questionDate, answer: answerContent })
        expect(mockRepo.save).toHaveBeenCalledWith(mockChat)

        //qui testo dettagliatamente dato che Chat ha 'question' e 'answer' di tipo Message
        expect(result.id).toEqual(id)
        expect(result.question.content).toEqual(questionContent)
        expect(result.question.timestamp).toEqual(questionDate.toISOString())
        expect(result.answer.content).toEqual(answerContent)
        expect(result.answer.timestamp).toEqual(answerDate.toISOString())
    });

    it('should fetch \'N\' chats when no lastChatId is provided', async () => {
        //arrange
        const mockChats = [
            {id: 'abe', question: 'question3?', questionDate: new Date('2025-01-03'), answer: 'answer3', answerDate: new Date('2025-01-03')},
            {id: 'abd', question: 'question2?', questionDate: new Date('2025-01-02'), answer: 'answer2', answerDate: new Date('2025-01-02')},
            {id: 'abc', question: 'question1?', questionDate: new Date('2025-01-01'), answer: 'answer1', answerDate: new Date('2025-01-01')},
        ];
        mockRepo.find.mockResolvedValue( mockChats );

        //act
        const result = await chatRepository.fetchStoricoChat('');

        //assert
        expect(mockRepo.find).toHaveBeenCalledWith({
            order: { answerDate: 'DESC' },
            take: 5
        });
        expect(result).toEqual(mockChats.reverse());
    });

    it('should fetch chat history with a given lastChatId', async () => {
        //arrange
        const lastChat = {
            id: 'abf',
            question: 'question4?',
            questionDate: new Date('2025-01-04'),
            answer: 'answer4',
            answerDate: new Date('2025-01-04')
        };

        const previousChats = [
            {id: 'abe', question: 'question3?', questionDate: new Date('2025-01-03'), answer: 'answer3', answerDate: new Date('2025-01-03')},
            {id: 'abd', question: 'question2?', questionDate: new Date('2025-01-02'), answer: 'answer2', answerDate: new Date('2025-01-02')},
            {id: 'abc', question: 'question1?', questionDate: new Date('2025-01-01'), answer: 'answer1', answerDate: new Date('2025-01-01')},
        ];

        mockRepo.findOne.mockResolvedValue(lastChat);
        mockRepo.find.mockResolvedValue(previousChats);
        
        //act
        const result = await chatRepository.fetchStoricoChat('abf', 4);

        //assert
        expect(mockRepo.findOne).toHaveBeenCalledWith({ where: {id: 'abf' }});
        expect(mockRepo.find).toHaveBeenCalledWith({
            where: { answerDate: expect.any(Object) },
            order: { answerDate: 'DESC' },
            take: 4,
        });
        
        expect(result).toEqual(previousChats.slice().reverse());
    });
}); 