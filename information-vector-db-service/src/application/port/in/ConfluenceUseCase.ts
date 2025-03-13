import { ConfluenceCmd } from 'src/domain/ConfluenceCmd.js';

export interface ConfluenceUseCase {
  fetchAndStoreConfluenceInfo(req: ConfluenceCmd): Promise<boolean>;
}
