/*export class Chat {
  id: string;
  question: string;
  answer: string;
  date: Date;
}*/
export class Message { 
  content: string; 
  timestamp: string; 
}

export class Chat {
  id: string;
  question: Message;
  answer: Message;
}
