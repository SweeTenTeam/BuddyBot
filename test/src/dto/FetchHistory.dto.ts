export class FetchHistoryDto {
    constructor(
        public readonly id: string, //UUID
        public readonly numChat: number
    ) {}
}