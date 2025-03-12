export class JiraCmd{
    private boardId: string
    private lastUpdate: string

    constructor(object: JSON) {
        this.boardId = object['boardId'];
        this.lastUpdate = object['lastUpdate'];
    }

    getBoardId(): string {
        return this.boardId;
    }

    getLastUpdate(): string {
        return this.lastUpdate;
    }
}