//export class RequestChatCMD {
//  id: string; // UUID
//  numChat: number;
//}

export class RequestChatCMD {
  constructor(
    public readonly id: string, // UUID
    public readonly numChat: number
  ) {}
}