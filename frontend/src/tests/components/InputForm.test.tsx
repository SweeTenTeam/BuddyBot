import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputForm from '@/components/InputForm';
import { useChat } from '@/providers/chatProvider';

// Mock del hook useChat
jest.mock('@/providers/chatProvider', () => ({
  useChat: jest.fn(),
}));

describe('InputForm component', () => {
  it('renders and handles input changes', async () => {
    const sendMessageMock = jest.fn();
    (useChat as jest.Mock).mockReturnValue({ sendMessage: sendMessageMock });

    render(<InputForm />);

    // Verifica che il textarea sia renderizzato
    const textarea = screen.getByPlaceholderText(/Type a message.../i) as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();

    // Digita un messaggio
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    expect(textarea).toHaveValue('Hello');

    // Verifica che il contatore dei caratteri venga aggiornato
    const charCount = screen.getByText(/5 \/ 10000/);
    expect(charCount).toBeInTheDocument();
  });

  it('limits text input to MAX_CHARS using paste', async () => {
    const sendMessageMock = jest.fn();
    (useChat as jest.Mock).mockReturnValue({ sendMessage: sendMessageMock });

    render(<InputForm />);

    const textarea = screen.getByPlaceholderText(/Type a message.../i) as HTMLTextAreaElement;

    // Simula un evento di paste con una stringa troppo lunga
    const longString = 'a'.repeat(10001);
    fireEvent.paste(textarea, {
      clipboardData: {
        getData: () => longString
      }
    });

    // Dopo il paste, il testo nel textarea dovrebbe essere troncato a MAX_CHARS
    expect(textarea.value.length).toBe(10000);

    // Verifica che il messaggio di errore sia visualizzato
    const errorMessage = screen.getByText(/10000 \/ 10000 LIMIT REACHED/);
    expect(errorMessage).toBeInTheDocument();
  });

  it('calls sendMessage on submit', async () => {
    const sendMessageMock = jest.fn();
    (useChat as jest.Mock).mockReturnValue({ sendMessage: sendMessageMock });

    render(<InputForm />);

    const textarea = screen.getByPlaceholderText(/Type a message.../i) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Hello' } });

    // Recupera il pulsante di submit tramite il role
    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(sendMessageMock).toHaveBeenCalledWith('Hello');
    });

    // Verifica che il textarea venga svuotato dopo l'invio
    expect(textarea).toHaveValue('');
  });

  it('adjusts textarea height dynamically', async () => {
    const sendMessageMock = jest.fn();
    (useChat as jest.Mock).mockReturnValue({ sendMessage: sendMessageMock });

    render(<InputForm />);

    const textarea = screen.getByPlaceholderText(/Type a message.../i) as HTMLTextAreaElement;

    // Imposta manualmente scrollHeight (JSDOM non calcola il layout)
    Object.defineProperty(textarea, 'scrollHeight', {
      value: 100,
      configurable: true,
    });
    // Memorizza l'altezza iniziale; dato che viene impostata a "auto", forziamo una conversione numerica
    const initialHeight = parseInt(textarea.style.height) || 0;

    // Simula la scrittura di un testo (che attiverà adjustHeight tramite onChange e useEffect)
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    // Poiché adjustHeight imposta height in base a scrollHeight, ci aspettiamo "100px"
    expect(textarea.style.height).toBe('100px');
    expect(parseInt(textarea.style.height)).toBeGreaterThan(initialHeight);
  });

  it('truncates input to MAX_CHARS when exceeding limit manually', async () => {
    const sendMessageMock = jest.fn();
    (useChat as jest.Mock).mockReturnValue({ sendMessage: sendMessageMock });
  
    render(<InputForm />);
  
    const textarea = screen.getByPlaceholderText(/Type a message.../i) as HTMLTextAreaElement;
  
    // Simula l'inserimento di 10001 caratteri uno per uno
    for (let i = 0; i < 10001; i++) {
      fireEvent.change(textarea, { target: { value: textarea.value + 'a' } });
    }
  
    // Dopo l'inserimento, il testo nel textarea dovrebbe essere troncato a MAX_CHARS
    expect(textarea.value.length).toBe(10000);
  
    // Verifica che il messaggio di errore sia visualizzato
    const errorMessage = screen.getByText(/10000 \/ 10000 LIMIT REACHED/);
    expect(errorMessage).toBeInTheDocument();
  });

  it('does not send message when input is empty or only whitespace', async () => {
    const sendMessageMock = jest.fn();
    (useChat as jest.Mock).mockReturnValue({ sendMessage: sendMessageMock });
  
    render(<InputForm />);
  
    const textarea = screen.getByPlaceholderText(/Type a message.../i) as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);
  
    // Simula l'invio di un messaggio vuoto (spazio)
    fireEvent.change(textarea, { target: { value: ' ' } });
    fireEvent.click(submitButton);
  
    // Verifica che il messaggio non sia stato inviato
    expect(sendMessageMock).not.toHaveBeenCalled();
  
    // Simula l'invio di un messaggio vuoto (stringa vuota)
    fireEvent.change(textarea, { target: { value: '' } });
    fireEvent.click(submitButton);
  
    // Verifica che il messaggio non sia stato inviato
    expect(sendMessageMock).not.toHaveBeenCalled();
  });
  
  
});
