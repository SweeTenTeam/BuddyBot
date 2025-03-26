import { render, screen, act } from "@testing-library/react";
import Home from "@/app/page";
import '@testing-library/jest-dom';

jest.mock('@fortawesome/fontawesome-svg-core/styles.css', () => {});
jest.mock('@/components/Bubble', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Mocked Bubble</div>),
  }));

describe("Home Component", () => {
  it("renders Header, Navbar, and ChatWindow", async () => {
    await act(async () => {
      render(<Home />);
    });

    // Verifica che il componente Header venga renderizzato
    expect(screen.getByRole("banner")).toBeInTheDocument();

    // Verifica che il componente Navbar venga renderizzato
    expect(screen.getByRole("navigation")).toBeInTheDocument();

    // Verifica che il componente ChatWindow venga renderizzato
    expect(screen.getByTestId("chat-window")).toBeInTheDocument();
  });
});
