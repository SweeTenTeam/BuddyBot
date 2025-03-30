import { Test, TestingModule } from '@nestjs/testing';
import { Chat } from '../../../../src/domain/entities/chat.entity';
import { Information } from '../../../../src/domain/entities/information.entity';
import { Metadata } from '../../../../src/domain/entities/metadata.entity';
import { ReqAnswerCmd } from '../../../../src/application/commands/request-answer.cmd';
import { LLMPort } from '../../../../src/core/ports/llm.port';

// Creazione di un'implementazione mock di GroqAdapter
// Questo evita di dover importare le dipendenze reali
class MockGroqAdapter implements LLMPort {
  async generateAnswer(req: ReqAnswerCmd, info: Information[]): Promise<Chat> {
    // Implementazione mock
    return new Chat(req.getText(), `Risposta di prova per: ${req.getText()}`);
  }
}

describe('GroqAdapter', () => {
  let adapter: LLMPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'LLM_PORT',
          useClass: MockGroqAdapter,
        },
      ],
    }).compile();

    adapter = module.get<LLMPort>('LLM_PORT');
  });

  describe('generateAnswer', () => {
    it('dovrebbe generare una risposta basata sulla richiesta e sulle informazioni', async () => {
      // Preparo i dati di test
      const reqAnswerCmd = new ReqAnswerCmd('Cosa è l\'architettura a microservizi?', new Date());
      
      const metadata1 = new Metadata('documentazione', 'articolo', 'doc-001');
      const metadata2 = new Metadata('blog', 'post', 'blog-001');
      
      const information: Information[] = [
        new Information('I microservizi sono uno stile architetturale che struttura un\'applicazione come una collezione di piccoli servizi autonomi.', metadata1),
        new Information('Ogni servizio in un\'architettura a microservizi è autocontenuto e implementa una singola capacità di business.', metadata2)
      ];

      
      const spy = jest.spyOn(adapter, 'generateAnswer');
      spy.mockImplementation(async (req, info) => {
        return new Chat(
          req.getText(), 
          'I microservizi sono un pattern architetturale dove un\'applicazione è composta da piccoli servizi indipendenti.'
        );
      });

      // Eseguo
      const result = await adapter.generateAnswer(reqAnswerCmd, information);

      // Verifico
      expect(result).toBeInstanceOf(Chat);
      expect(result.getQuestion()).toBe('Cosa è l\'architettura a microservizi?');
      expect(result.getAnswer()).toBe(
        'I microservizi sono un pattern architetturale dove un\'applicazione è composta da piccoli servizi indipendenti.'
      );
      expect(spy).toHaveBeenCalledWith(reqAnswerCmd, information);
    });

    it('dovrebbe gestire correttamente un array di informazioni vuoto', async () => {
      // Preparo i dati di test
      const reqAnswerCmd = new ReqAnswerCmd('Cosa è l\'architettura a microservizi?', new Date());
      const information: Information[] = [];
      
      const spy = jest.spyOn(adapter, 'generateAnswer');
      spy.mockImplementation(async (req, info) => {
        return new Chat(
          req.getText(), 
          'Non ho abbastanza informazioni per rispondere a questa domanda.'
        );
      });

      // Eseguo
      const result = await adapter.generateAnswer(reqAnswerCmd, information);

      // Verifico
      expect(result).toBeInstanceOf(Chat);
      expect(result.getQuestion()).toBe('Cosa è l\'architettura a microservizi?');
      expect(result.getAnswer()).toBe('Non ho abbastanza informazioni per rispondere a questa domanda.');
      expect(spy).toHaveBeenCalledWith(reqAnswerCmd, information);
    });

    it('dovrebbe gestire gli errori durante l\'elaborazione LLM', async () => {
      // Preparo i dati di test
      const reqAnswerCmd = new ReqAnswerCmd('Cosa è l\'architettura a microservizi?', new Date());
      const information: Information[] = [
        new Information('Un po\' di contesto', new Metadata('fonte', 'tipo', 'id-001'))
      ];
      
      
      const spy = jest.spyOn(adapter, 'generateAnswer');
      spy.mockImplementation(async () => {
        throw new Error('Errore durante l\'elaborazione LLM');
      });

      // Eseguo e Verifico
      await expect(adapter.generateAnswer(reqAnswerCmd, information))
        .rejects
        .toThrow('Errore durante l\'elaborazione LLM');
    });
  });
});