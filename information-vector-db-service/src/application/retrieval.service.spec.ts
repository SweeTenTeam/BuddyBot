import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { RetrievalService } from './retrieval.service.js';
import { RetrievalPort, RETRIEVAL_PORT } from './port/out/retrieval-info.port.js';
import { RetrieveCmd } from '../domain/command/retreive-cmd.js';
import { Information } from '../domain/business/information.js';
import { Metadata} from '../domain/business/metadata.js';
import { Origin, Type } from '../domain/shared/enums.js';


describe('RetrievalService', () => {
  let service: RetrievalService;
  let retrievalPort: jest.Mocked<RetrievalPort>;

  beforeEach(async () => {
    const mockRetrievalPort: RetrievalPort = {
      retrieveRelevantInfo: jest.fn<(req: RetrieveCmd) => Promise<Information[]>>()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetrievalService,
        {
          provide: RETRIEVAL_PORT,
          useValue: mockRetrievalPort,
        },
      ],
    }).compile();

    service = module.get<RetrievalService>(RetrievalService);
    retrievalPort = module.get(RETRIEVAL_PORT);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve information using the port', async () => {
    // Arrange
    const mockCmd = new RetrieveCmd();
    mockCmd.query = 'test query';
    
    const mockInfo = [
      new Information('test content', new Metadata(Origin.GITHUB, Type.COMMIT, 'test-id'))
    ];
    
    retrievalPort.retrieveRelevantInfo.mockResolvedValue(mockInfo);

    // Act
    const result = await service.retrieveRelevantInfo(mockCmd);

    // Assert
    expect(retrievalPort.retrieveRelevantInfo).toHaveBeenCalledWith(mockCmd);
    expect(result).toEqual(mockInfo);
  });

  it('should handle empty results', async () => {
    // Arrange
    const mockCmd = new RetrieveCmd();
    mockCmd.query = 'test query';
    retrievalPort.retrieveRelevantInfo.mockResolvedValue([]);

    // Act
    const result = await service.retrieveRelevantInfo(mockCmd);

    // Assert
    expect(result).toEqual([]);
  });
}); 