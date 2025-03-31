export class Message { 
  constructor(
    public readonly content: string,
    public readonly timestamp: string, 
  ) {
    if(timestamp === ''){
      this.timestamp = new Date().toISOString();
    }
  }
}