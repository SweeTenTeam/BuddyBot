export class CreateChatDTO {
    constructor(
        public readonly question: string,
        public readonly date: Date,
        public readonly answer: string
    ) {}
    
}