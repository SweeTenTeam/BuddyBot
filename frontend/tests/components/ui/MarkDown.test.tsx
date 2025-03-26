import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MarkDown from "@/components/ui/MarkDown";

// Mock delle dipendenze
jest.mock("react-markdown", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked ReactMarkdown</div>),
}));

jest.mock("remark-gfm", () => ({}));
jest.mock("rehype-highlight", () => ({}));


describe("MarkDown component", () => {
  it("renders MarkDown component correctly", () => {
    // Contenuto di test
    const content = "# Hello, Markdown!";

    // Renderizza il componente
    render(<MarkDown content={content} />);

    // Verifica che il mock di ReactMarkdown venga usato
    const markdownMock = screen.getByText(/Mocked ReactMarkdown/);
    expect(markdownMock).toBeInTheDocument();
  });

  it("renders empty content correctly", () => {
    // Renderizza il componente con contenuto vuoto
    render(<MarkDown content="" />);

    // Verifica che non ci sia alcun errore e il componente venga renderizzato
    expect(screen.getByText(/Mocked ReactMarkdown/)).toBeInTheDocument();
  });
});
