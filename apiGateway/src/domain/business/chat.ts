import { Message } from "./message";

export class Chat {
  constructor(
    public readonly id: string,
    public readonly question: Message,
    public readonly answer: Message,
    public readonly lastUpdate: string,
  ) {}
}
