import { Message } from './message';

describe('Message', () => {
  it('should create an instance with provided content and timestamp', () => {
    const content = 'Hello, world!';
    const timestamp = '2024-04-02T12:00:00.000Z';
    const message = new Message(content, timestamp);

    expect(message.content).toBe(content);
    expect(message.timestamp).toBe(timestamp);
  });

  it('should generate a timestamp if an empty string is provided', () => {
    const content = 'Auto-timestamped message';
    const message = new Message(content, '');

    expect(message.content).toBe(content);
    expect(message.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});
