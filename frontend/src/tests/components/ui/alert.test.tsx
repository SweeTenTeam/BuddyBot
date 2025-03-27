import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import '@testing-library/jest-dom';

describe("Alert Component", () => {
  it("renders Alert with default variant", () => {
    render(
      <Alert variant="default">
        <AlertTitle>Test Title</AlertTitle>
        <AlertDescription>Test Description</AlertDescription>
      </Alert>
    );

    // Verifica che il titolo e la descrizione siano nel documento
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();

    // Verifica che l'alert abbia la classe di variante di default
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("bg-background");
    expect(alert).toHaveClass("text-foreground");
  });

  it("renders Alert with destructive variant", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Test Title</AlertTitle>
        <AlertDescription>Test Description</AlertDescription>
      </Alert>
    );

    // Verifica che il titolo e la descrizione siano nel documento
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();

    // Verifica che l'alert abbia la classe di variante destructive
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("text-destructive-foreground");
  });
});
