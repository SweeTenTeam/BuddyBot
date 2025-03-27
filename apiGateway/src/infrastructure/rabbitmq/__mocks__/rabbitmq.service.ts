export const RabbitMQServiceMock = {
  sendToQueue: jest.fn().mockImplementation((queue, data) => {
    console.log(`📥 Mock RabbitMQ: ricevuto messaggio su ${queue}`, data);

    if (queue === 'chatbot_queue') {
      return Promise.resolve({
        question: data.question,
        answer: 'Risposta mockata',
        timestamp: new Date().toISOString(),
      });
    }

    if (queue === 'storico_queue') {
      return Promise.resolve([
        {
          id: 'mock-chat-1',
          question: {
            content: data.question?.content || 'Domanda mockata',
            timestamp: data.question?.timestamp || new Date().toISOString(),
          },
          answer: {
            content: data.answer?.content || 'Risposta mockata',
            timestamp: data.answer?.timestamp || new Date().toISOString(),
          },
        },
      ]);
    }

    if (queue === 'storico_save_queue') {
      return Promise.resolve({ ...data, id: 'mock-id-123' });
    }

    return Promise.resolve(null);
  }),
};
