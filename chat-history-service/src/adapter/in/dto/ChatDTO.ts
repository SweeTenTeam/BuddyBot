import { MessageDTO } from "./MessageDTO";

export class ChatDTO {
  constructor(
    public readonly id: string,
    public readonly question: MessageDTO,
    public readonly answer: MessageDTO,
  ) {}
}
