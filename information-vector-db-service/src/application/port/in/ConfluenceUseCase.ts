import { ConfluenceCmd } from '../../../domain/command/ConfluenceCmd.js';
import { Result } from '../../../domain/business/Result.js';

export interface ConfluenceUseCase {
  fetchAndStoreConfluenceInfo(req: ConfluenceCmd): Promise<Result>;
}

export const CONFLUENCE_USECASE = Symbol('CONFLUENCE_USECASE');