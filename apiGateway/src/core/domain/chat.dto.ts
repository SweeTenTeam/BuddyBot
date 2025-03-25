/*export class ChatDTO {
  id: string; // UUID
  question: string;
  answer: string;
  date: Date;
}
*/
export class ChatDTO {
  id: string;
  question: Message;
  answer: Message;
}

export class Message { 
  content: string; 
  timestamp: string; 
}
