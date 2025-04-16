export class JiraCmd {
  constructor(
    public readonly boardId: number,
    public readonly lastUpdate?: Date
  ) {}

  getBoardId(): number {
    return this.boardId;
  }
}
