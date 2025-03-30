import { ConfluenceCmd } from 'src/domain/command/ConfluenceCmd.js';

export interface ConfluenceUseCase {
  fetchAndStoreConfluenceInfo(req: ConfluenceCmd): Promise<boolean>;
}

export const CONFLUENCE_USECASE = Symbol('CONFLUENCE_USECASE');