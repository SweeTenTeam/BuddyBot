export class ConfluenceDocument {
  constructor(
    private id: string,
    private title: string,
    private status: string,
    private author: string,
    private owner: string,
    private space: number,
    private content: string,
  ) {}

  // Getter methods
  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getStatus(): string {
    return this.status;
  }

  getAuthor(): string {
    return this.author;
  }

  getOwner(): string {
    return this.owner;
  }

  getContent(): string {
    return this.content;
  }

  getSpace(): number {
    return this.space;
  }
}
