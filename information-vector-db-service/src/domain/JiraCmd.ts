export class JiraCmd {
  private boardId: number;
  private lastUpdate: string;

  constructor(object: JSON) {
    this.boardId = object['boardId'];
    this.lastUpdate = object['lastUpdate'];
  }

  getBoardId(): number {
    return this.boardId;
  }

  getLastUpdate(): string {
    return this.lastUpdate;
  }
}
