export class Chat {
  private question: string;
  private answer: string;

  constructor(question: string, answer: string) {
    this.question = question;
    this.answer = answer;
  }

  getQuestion(): string {
    return this.question;
  }

  getAnswer(): string {
    return this.answer;
  }
}
