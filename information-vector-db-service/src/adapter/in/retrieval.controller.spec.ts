import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { RetrievalController } from './retrieval.controller.js';
import { RETRIEVAL_USE_CASE, RetrievalUseCase } from '../../application/port/in/retrieval-usecase.port.js';
import { RetrieveCmd } from '../../domain/command/retreive-cmd.js';
import { Information } from '../../domain/business/information.js';
import { Metadata, Origin, Type } from '../../domain/business/metadata.js';
import { RetrievalQueryDTO } from './dto/retrival-query.dto.js';

describe('RetrievalController', () => {
  let controller: RetrievalController;
  let retrievalService: jest.Mocked<RetrievalUseCase>;

  beforeEach(async () => {
    const mockRetrievalService = {
      retrieveRelevantInfo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RetrievalController],
      providers: [
        {
          provide: RETRIEVAL_USE_CASE,
          useValue: mockRetrievalService,
        },
      ],
    }).compile();

    controller = module.get<RetrievalController>(RetrievalController);
    retrievalService = module.get(RETRIEVAL_USE_CASE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should retrieve information successfully', async () => {
    const mockQuery = new RetrievalQueryDTO();
    mockQuery.query = 'test query';
    
    const mockResults = [
      new Information('test content', new Metadata(Origin.CONFLUENCE, Type.COMMMIT, 'test-id')),
    ];
    
    retrievalService.retrieveRelevantInfo.mockResolvedValue(mockResults);
    const result = await controller.retrieveInformation(mockQuery);

    expect(retrievalService.retrieveRelevantInfo).toHaveBeenCalledWith(expect.any(RetrieveCmd));
    expect(result).toEqual(mockResults);
  });

  it('should handle errors during retrieval', async () => {
    const mockQuery = new RetrievalQueryDTO();
    mockQuery.query = 'test query';
    
    retrievalService.retrieveRelevantInfo.mockRejectedValue(new Error('Test error'));

    await expect(controller.retrieveInformation(mockQuery)).rejects.toThrow('Test error');
  });
}); 