export class ProvChat {
  constructor(
    public readonly question: string,
    public readonly answer: string,
    public readonly timestamp: string,
  ) {}
}