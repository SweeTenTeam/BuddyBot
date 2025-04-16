export class CreateChatDTO {
    constructor(
        public readonly question: string,
        public readonly timestamp: Date,
        public readonly answer: string,
    ) {}
    
}