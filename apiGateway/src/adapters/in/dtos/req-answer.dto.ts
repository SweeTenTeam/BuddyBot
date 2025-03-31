/*export class ReqAnswerDTO {
    text: string;  // La domanda dell'utente
    date: string;  // Timestamp della domanda
}*/
  
export class ReqAnswerDTO {
    constructor(
      public readonly text: string,
      public readonly date: string
    ) {}
  }