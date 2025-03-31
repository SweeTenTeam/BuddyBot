export class CommentPR{
    constructor(private authorName: string, private content: string, private date: Date ){}

    getAuthorName(): string {
        return this.authorName;
    }

    getContent(): string {
        return this.content;
    }

    getDate(): Date {
        return this.date;
    }
}