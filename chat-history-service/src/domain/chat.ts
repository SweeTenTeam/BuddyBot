export class Chat{
    constructor(
        public readonly id: string, //UUID?
        public readonly question: string,
        public readonly questionDate: Date,
        public readonly answer: string,
        public readonly answerDate: Date,
    ) {}
}