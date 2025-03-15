export class Chat{
    constructor(
        public readonly id: string, //UUID?
        public readonly question: string,
        public readonly answer: string,
        public readonly date: Date
    ) {}
}