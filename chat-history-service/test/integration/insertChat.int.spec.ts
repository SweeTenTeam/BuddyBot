import { Test, TestingModule } from '@nestjs/testing';
import { ChatConsumer } from 'src/adapter/in/event/chat.consumer';
import { InsertChatAdapter } from 'src/adapter/out/insertChat.adapter';
import { InsertChatService } from 'src/application/insertChat.service';
import { ChatRepository } from 'src/adapter/out/persistence/chat.repository';
import { Chat } from 'src/domain/chat';
import { Message } from 'src/domain/message';
import { ChatDTO } from 'src/adapter/in/dto/ChatDTO';
import { MessageDTO } from 'src/adapter/in/dto/MessageDTO';
import { IC_USE_CASE } from 'src/application/port/in/insertChat-usecase.port';
import { IC_PORT_OUT } from 'src/application/port/out/insertChat.port';

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
    const question = new MessageDTO('Question test?', new Date().toISOString());
    const answer = new MessageDTO('Answer test!', new Date(Date.now() + 1000).toISOString());
    const chatId = 'chatabc';

    const inputDTO = new ChatDTO(chatId, question, answer);

    const expectedChat = new Chat(
      chatId,
      new Message(question.content, question.timestamp),
      new Message(answer.content, answer.timestamp)
    );

    chatRepoMock.insertChat.mockResolvedValue(expectedChat);

    const result = await controller.handleMessage(inputDTO);

    expect(chatRepoMock.insertChat).toHaveBeenCalledWith(
      question.content,
      answer.content,
      new Date(question.timestamp)
    );

    expect(result).toEqual(inputDTO);
  });
});
