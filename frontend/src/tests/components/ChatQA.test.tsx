import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatQA from '@/components/ChatQA';
import { QuestionAnswer } from '@/types/QuestionAnswer';

// Mock the Bubble component
jest.mock('@/components/Bubble', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked Bubble</div>),
}));

describe('ChatQA component', () => {
  it('renders ChatQA component with question and answer', () => {
    // Crea un oggetto questionAnswer con l'id aggiunto
    const questionAnswer: QuestionAnswer = {
      id: '123',
      question: { content: "What is React?", timestamp: new Date().toISOString() },
      answer: { content: "React is a JavaScript library.", timestamp: new Date().toISOString() },
      error: false,
      loading: false
    };

    // Renderizza il componente
    render(<ChatQA questionAnswer={questionAnswer} />);

    // Verifica che entrambi i bubble (domanda e risposta) siano renderizzati
    const bubbles = screen.getAllByText(/Mocked Bubble/i);
    expect(bubbles).toHaveLength(2);
  });
});
