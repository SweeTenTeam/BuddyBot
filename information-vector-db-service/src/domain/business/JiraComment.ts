export class JiraComment {
  public body: string;
  public author: string;
  public created: string;

  constructor(body: string, author: string, created: string) {
    this.body = body;
    this.author = author;
    this.created = created;
  }

  toJson(): JSON {
    const result: JSON = JSON;
    result['body'] = this.body;
    result['author'] = this.author;
    result['created'] = this.created;
    return result;
  }
} 