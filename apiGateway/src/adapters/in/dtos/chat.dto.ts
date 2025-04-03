import { MessageDto } from "./message.dto";

export class ChatDTO {
  constructor(
    public readonly id: string,
    public readonly question: MessageDto,
    public readonly answer: MessageDto,
    public readonly lastUpdate: string,
  ) {}
}
