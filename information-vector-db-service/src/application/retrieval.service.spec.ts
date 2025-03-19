import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { RetrievalService } from './retrieval.service.js';
import { RETRIEVAL_PORT, RetrievalPort } from './port/out/retrieval-info.port.js';
import { RetrieveCmd } from '../domain/command/retreive-cmd.js';
import { Information } from '../domain/business/information.js';
import { Metadata, Origin, Type } from '../domain/business/metadata.js';

describe('RetrievalService', () => {
  let service: RetrievalService;
  let retrievalAdapter: jest.Mocked<RetrievalPort>;

  beforeEach(async () => {
    const mockRetrievalAdapter = {
      retrieveRelevantInfo: jest.fn().mockImplementation((cmd: RetrieveCmd) => Promise.resolve([])) as jest.MockedFunction<RetrievalPort['retrieveRelevantInfo']>,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetrievalService,
        {
          provide: RETRIEVAL_PORT,
          useValue: mockRetrievalAdapter,
        },
      ],
    }).compile();

    service = module.get<RetrievalService>(RetrievalService);
    retrievalAdapter = module.get(RETRIEVAL_PORT);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve information successfully', async () => {
    const mockCmd = new RetrieveCmd();
    mockCmd.query = 'test query';
    
    const mockResults = [
      new Information('test content', new Metadata(Origin.CONFLUENCE, Type.COMMMIT, 'test-id')),
    ];
    
    retrievalAdapter.retrieveRelevantInfo.mockResolvedValue(mockResults);
    const result = await service.retrieveRelevantInfo(mockCmd);

    expect(retrievalAdapter.retrieveRelevantInfo).toHaveBeenCalledWith(mockCmd);
    expect(result).toEqual(mockResults);
  });
}); 