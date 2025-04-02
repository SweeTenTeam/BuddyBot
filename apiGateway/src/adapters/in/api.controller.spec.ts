import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { GetChatUseCase } from '../../application/ports/in/get-chat';
import { GetStoricoUseCase } from '../../application/ports/in/get-storico';
import { ChatDTO } from './dtos/chat.dto';
import { MessageDto } from './dtos/message.dto';
import { RequestChatDTO } from './dtos/request-chat.dto';
import { ReqAnswerDTO } from './dtos/req-answer.dto';


describe('ApiController', () => {
  let controller: ApiController;
  let getChatUseCase: GetChatUseCase;
  let getStoricoUseCase: GetStoricoUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        {
          provide: 'GetChatUseCase',
          useValue: { execute: jest.fn() },
        },
        {
          provide: 'GetStoricoUseCase',
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    getChatUseCase = module.get<GetChatUseCase>('GetChatUseCase');
    getStoricoUseCase = module.get<GetStoricoUseCase>('GetStoricoUseCase');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get storico', async () => {
    const storicoMock = [new ChatDTO('1', new MessageDto('Q1', '2023-01-01T00:00:00Z'), new MessageDto('A1', '2023-01-01T00:00:00Z'))];
    jest.spyOn(getStoricoUseCase, 'execute').mockResolvedValue(storicoMock);

    const result = await controller.getStorico('1', 1);
    expect(result).toEqual(storicoMock);
  });

  it('should get storico with default values', async () => {
    const storicoMock = [];
    jest.spyOn(getStoricoUseCase, 'execute').mockResolvedValue(storicoMock);

    const result = await controller.getStorico();
    expect(result).toEqual([]);
  });

  it('should handle error in getStorico', async () => {
    jest.spyOn(getStoricoUseCase, 'execute').mockRejectedValue(new Error('Errore'));

    await expect(controller.getStorico('1', 1)).rejects.toThrow('Errore');
  });

  it('should get risposta', async () => {
    const rispostaMock = new ChatDTO('1', new MessageDto('Test Question', '2023-01-01T00:00:00Z'), new MessageDto('Test Answer', '2023-01-01T00:00:00Z'));
    jest.spyOn(getChatUseCase, 'execute').mockResolvedValue(rispostaMock);

    const result = await controller.getRisposta('Test Question', '2023-01-01T00:00:00Z');
    expect(result).toEqual(rispostaMock);
  });

  it('should handle error in getRisposta', async () => {
    jest.spyOn(getChatUseCase, 'execute').mockRejectedValue(new Error('Errore'));

    await expect(controller.getRisposta('Test Question', '2023-01-01T00:00:00Z')).rejects.toThrow('Errore');
  });

  it('should get risposta senza timestamp', async () => {
    const rispostaMock = new ChatDTO('1', new MessageDto('Test Question', '2023-01-01T00:00:00Z'), new MessageDto('Test Answer', '2023-01-01T00:00:00Z'));
    jest.spyOn(getChatUseCase, 'execute').mockResolvedValue(rispostaMock);

    const result = await controller.getRisposta('Test Question', '');
    expect(result).toEqual(rispostaMock);
  });
});