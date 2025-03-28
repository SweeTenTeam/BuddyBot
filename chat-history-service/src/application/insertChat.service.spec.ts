import { InsertChatCmd } from "src/domain/insertChatCmd";
import { InsertChatService } from "./insertChat.service";
import { InsertChatPort } from "./port/out/insertChat.port";


const mockInsertChatPort: jest.Mocked<InsertChatPort> = {
    insertChat: jest.fn(), //mock func
};

describe( 'InsertChatService', () => {
    let service: InsertChatService;

    beforeEach(() => {
        service = new InsertChatService(mockInsertChatPort);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call InsertChatAdapter.insertChat with correct parameters', async () => {
        const cmdMock: InsertChatCmd = { question: 'What\'s your name?', answer: 'My name is Mario Rossi', date: new Date()};
        mockInsertChatPort.insertChat.mockResolvedValue(true);

        const result = await service.insertChat(cmdMock);

        expect(mockInsertChatPort.insertChat).toHaveBeenCalledWith(cmdMock);
        expect(result).toBe(true);
    });
});