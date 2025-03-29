export class FetchJiraDto {
    constructor (
        public readonly boardId: number,
        public readonly lastUpdate: string
    ){}
}