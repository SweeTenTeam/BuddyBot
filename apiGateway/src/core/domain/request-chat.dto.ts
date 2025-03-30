export class RequestChatDTO {
  constructor(
    public readonly id: string, // UUID
    public readonly numChat: number
  ) {}
}