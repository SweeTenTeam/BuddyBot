export class ReqAnswerCmd {
  private text: string;
  private date: Date;

  constructor(text: string, date: Date) {
    this.text = text;
    this.date = date;
  }

  getText(): string {
    return this.text;
  }

  getDate(): Date {
    return this.date;
  }
}
