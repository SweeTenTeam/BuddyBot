import { Test, TestingModule } from '@nestjs/testing';
import { ElaborazioneService } from '../../../src/core/services/elaborazione.service';
import { LLM_PORT } from '../../../src/core/ports/llm.port';
import { VECTOR_DB_PORT } from '../../../src/core/ports/vector-db.port';
import { ReqAnswerCmd } from '../../../src/application/commands/request-answer.cmd';
import { Chat } from '../../../src/domain/entities/chat.entity';
import { Information } from '../../../src/domain/entities/information.entity';
import { Metadata } from '../../../src/domain/entities/metadata.entity';

describe('ElaborazioneService', () => {
  let service: ElaborazioneService;
  let mockLlmPort;
  let mockVectorDbPort;

  beforeEach(async () => {
    // Create mocks for the ports
    mockLlmPort = {
      generateAnswer: jest.fn()
    };
    
    mockVectorDbPort = {
      searchVectorDb: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElaborazioneService,
        {
          provide: LLM_PORT,
          useValue: mockLlmPort,
        },
        {
          provide: VECTOR_DB_PORT,
          useValue: mockVectorDbPort,
        },
      ],
    }).compile();

    service = module.get<ElaborazioneService>(ElaborazioneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get an answer successfully', async () => {
    // Test data
    const requestText = 'A cosa servono i microservizi?';
    const requestDate = new Date();
    const reqAnswerCmd = new ReqAnswerCmd(requestText, requestDate);
    
    // Mock relevant context from vector DB
    const mockInformation = [
      new Information(
        'I microservizi sono un approccio architetturale che consiste nel suddividere un\'applicazione in servizi più piccoli.',
        new Metadata('documentation', 'text', 'doc123')
      )
    ];
    
    // Mock chat response
    const mockChatResponse = new Chat(
      requestText,
      'I microservizi sono un\'architettura che divide un\'applicazione in servizi indipendenti e specializzati.'
    );

    // Setup mock implementations
    mockVectorDbPort.searchVectorDb.mockResolvedValue(mockInformation);
    mockLlmPort.generateAnswer.mockResolvedValue(mockChatResponse);

    // Execute the method
    const result = await service.getAnswer(reqAnswerCmd);

    // Verify results
    expect(mockVectorDbPort.searchVectorDb).toHaveBeenCalledWith(reqAnswerCmd);
    expect(mockLlmPort.generateAnswer).toHaveBeenCalledWith(reqAnswerCmd, mockInformation);
    expect(result).toEqual(mockChatResponse);
    expect(result.getQuestion()).toEqual(requestText);
    expect(result.getAnswer()).toBeDefined();
  });
});