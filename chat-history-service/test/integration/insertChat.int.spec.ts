import { Test, TestingModule } from '@nestjs/testing';
import { ChatConsumer } from 'src/adapter/in/event/chat.consumer';
import { InsertChatAdapter } from 'src/adapter/out/insertChat.adapter';
import { InsertChatService } from 'src/application/insertChat.service';
import { ChatRepository } from 'src/adapter/out/persistence/chat.repository';
import { Chat } from 'src/domain/chat';
import { Message } from 'src/domain/message';
import { IC_USE_CASE } from 'src/application/port/in/insertChat-usecase.port';
import { IC_PORT_OUT } from 'src/application/port/out/insertChat.port';
import { CreateChatDTO } from 'src/adapter/in/dto/CreateChatDTO';

describe('InsertChat Integration (Controller -> Service -> Adapter -> Repomock)', () => {
  let controller: ChatConsumer;
  let chatRepoMock: jest.Mocked<ChatRepository>;

  beforeEach(async () => {
    chatRepoMock = {
      insertChat: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatConsumer],
      providers: [
        InsertChatService,
        InsertChatAdapter,
        {
          provide: IC_USE_CASE,
          useExisting: InsertChatService,
        },
        {
          provide: IC_PORT_OUT,
          useExisting: InsertChatAdapter,
        },
        { provide: ChatRepository, useValue: chatRepoMock }
      ],
    }).compile();

    controller = module.get<ChatConsumer>(ChatConsumer);
  });

  it('should insert a chat and return ChatDTO', async () => {
    //arrange
    const questionText = 'Question test?';
    const answerText = 'Answer test!';
    const questionTimestamp = new Date().toISOString();
    const answerTimestamp = new Date(Date.now() + 1000).toISOString();
    const lastFetchTimestamp = new Date().toISOString();

    const inputDTO = new CreateChatDTO(questionText, questionTimestamp, answerText);

    const mockChatEntity = {
      id: 'chat123',
      question: questionText,
      questionDate: new Date(questionTimestamp),
      answer: answerText,
      answerDate: new Date(answerTimestamp),
      lastFetch: lastFetchTimestamp,
    };

    chatRepoMock.insertChat.mockResolvedValue(mockChatEntity);

    //act
    const result = await controller.handleMessage(inputDTO);

    //assert
    expect(chatRepoMock.insertChat).toHaveBeenCalledWith(
      questionText,
      answerText,
      new Date(questionTimestamp)
    );

    expect(result).toEqual({
      id: 'chat123',
      question: {
        content: questionText,
        timestamp: questionTimestamp,
      },
      answer: {
        content: answerText,
        timestamp: answerTimestamp,
      },
      lastFetch: lastFetchTimestamp,
    });
  });
});
