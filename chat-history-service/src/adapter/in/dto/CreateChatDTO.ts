export class CreateChatDTO {
    constructor(
        public readonly question: string,
        public readonly timestamp: string,
        public readonly answer: string
    ) {}
    
}