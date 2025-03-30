/*export class Chat {
  id: string;
  question: string;
  answer: string;
  date: Date;
}*/

import { Message } from "./message";



export class Chat {
  constructor(
    public readonly id: string,
    public readonly question: Message,
    public readonly answer: Message,
  ) {}
}
