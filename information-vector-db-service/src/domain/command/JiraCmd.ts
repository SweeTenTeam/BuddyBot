export class JiraCmd {
  constructor(
    public readonly boardId: number,
    public readonly lastUpdate: string
  ) {}

  getBoardId(): number {
    return this.boardId;
  }

  getLastUpdate(): string {
    return this.lastUpdate;
  }
}
