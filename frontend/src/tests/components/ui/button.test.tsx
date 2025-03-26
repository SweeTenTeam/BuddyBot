import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import '@testing-library/jest-dom';

describe("Button Component", () => {
  it("renders Button with default variant and size", () => {
    render(<Button>Default Button</Button>);

    // Verifica che il bottone sia nel documento
    const button = screen.getByRole("button", { name: /default button/i });
    expect(button).toBeInTheDocument();

    // Verifica che il bottone abbia le classi per la variante default
    expect(button).toHaveClass("bg-primary");
    expect(button).toHaveClass("text-primary-foreground");
  });

  it("renders Button with destructive variant", () => {
    render(<Button variant="destructive">Destructive Button</Button>);

    // Verifica che il bottone sia nel documento
    const button = screen.getByRole("button", { name: /destructive button/i });
    expect(button).toBeInTheDocument();

    // Verifica che il bottone abbia le classi per la variante destructive
    expect(button).toHaveClass("bg-destructive");
    expect(button).toHaveClass("text-white");
  });

  it("renders Button with outline variant", () => {
    render(<Button variant="outline">Outline Button</Button>);

    // Verifica che il bottone sia nel documento
    const button = screen.getByRole("button", { name: /outline button/i });
    expect(button).toBeInTheDocument();

    // Verifica che il bottone abbia le classi per la variante outline
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("bg-background");
  });

  it("renders Button with different sizes", () => {
    // Test size default
    render(<Button size="default">Default Size Button</Button>);
    const defaultButton = screen.getByRole("button", { name: /default size button/i });
    expect(defaultButton).toHaveClass("h-9");
    expect(defaultButton).toHaveClass("px-4");

    // Test size small
    render(<Button size="sm">Small Size Button</Button>);
    const smallButton = screen.getByRole("button", { name: /small size button/i });
    expect(smallButton).toHaveClass("h-8");
    expect(smallButton).toHaveClass("px-3");

    // Test size large
    render(<Button size="lg">Large Size Button</Button>);
    const largeButton = screen.getByRole("button", { name: /large size button/i });
    expect(largeButton).toHaveClass("h-10");
    expect(largeButton).toHaveClass("px-6");
  });

  it("renders Button as a child of another component", () => {
    render(
      <Button asChild>
        <span>Button as Child</span>
      </Button>
    );

    // Verifica che il componente abbia il comportamento di un "span"
    const button = screen.getByText("Button as Child");
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("SPAN");
  });
});
