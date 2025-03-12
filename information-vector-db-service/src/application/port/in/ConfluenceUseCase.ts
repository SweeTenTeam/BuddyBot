import { ConfluenceCmd } from 'src/domain/ConfluenceCmd';

export interface ConfluenceUseCase {
  fetchAndStoreConfluenceInfo(req: ConfluenceCmd): Promise<boolean>;
}
