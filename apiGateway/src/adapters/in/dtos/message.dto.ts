export class MessageDto { 
  constructor(
    public readonly content: string,
    public readonly timestamp: string,
  ) {}
}