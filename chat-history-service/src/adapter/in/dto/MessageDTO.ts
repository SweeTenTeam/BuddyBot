export class MessageDTO { 
  constructor(
    public readonly content: string,
    public readonly timestamp: string,
  ) {}
}