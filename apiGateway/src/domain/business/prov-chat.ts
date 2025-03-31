/*export class ProvChat {
  question: string;  // Domanda dell'utente
  answer: string;    // Risposta generata dal chatbot
  timestamp: string; // Timestamp della domanda
}
*/
export class ProvChat {
  constructor(
    public readonly question: string,
    public readonly answer: string,
    public readonly timestamp: string,
  ) {}
}