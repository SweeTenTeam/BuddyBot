import { Repository } from "typeorm";
import { ChatRepository } from "./chat.repository"
import { ChatEntity } from "./chat-entity";

describe('ChatRepository', () => {
    let chatRepository: ChatRepository;
    let mockRepo: jest.Mocked<Repository<ChatEntity>>;

    beforeEach(() =>{
        mockRepo = {
            create: jest.fn(),
            save: jest.fn()
        } as any
        chatRepository = new ChatRepository(mockRepo)
    });

    it('should create a new chat', async () => {
        //arrange
        const id = 'abc'
        const question = 'question?'
        const answer = 'answer'
        const questionDate = new Date()
        const answerDate = new Date()
        answerDate.setHours(answerDate.getHours()+1)
        const mockChat = { id, question, answer, answerDate, questionDate }

        mockRepo.create.mockReturnValue( mockChat )

        //act
        const result = await chatRepository.insertChat(question, answer, questionDate)

        //assert
        expect(mockRepo.create).toHaveBeenCalledWith({ question, questionDate, answer })
        expect(mockRepo.save).toHaveBeenCalledWith(mockChat)
        expect(result).toEqual(true)
    })
}); 

