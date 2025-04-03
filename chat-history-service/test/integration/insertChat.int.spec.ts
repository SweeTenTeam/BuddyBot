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
    // arrange
    const questionText = 'Question test?';
    const answerText = 'Answer test!';
    const questionTimestamp = new Date().toISOString();
    const lastFetchTimestamp = new Date().toISOString();

    const inputDTO = new CreateChatDTO(questionText, questionTimestamp, answerText);

    const expectedChat = new Chat(
      'chat123',
      new Message(questionText, questionTimestamp),
      new Message(answerText, new Date(Date.now() + 1000).toISOString()),
      lastFetchTimestamp
    );

    chatRepoMock.insertChat.mockResolvedValue(expectedChat);

    // act
    const result = await controller.handleMessage(inputDTO);

    // assert
    expect(chatRepoMock.insertChat).toHaveBeenCalledWith(
      questionText,
      answerText,
      new Date(questionTimestamp)
    );

    expect(result).toBeInstanceOf(Chat);
    expect(result.id).toEqual(expectedChat.id);
    expect(result.question.content).toEqual(questionText);
    expect(result.question.timestamp).toEqual(questionTimestamp);
    expect(result.answer.content).toEqual(answerText);
    expect(result.lastFetch).toEqual(lastFetchTimestamp);
  });
});
