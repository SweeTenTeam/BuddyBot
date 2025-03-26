import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "@/components/Header";
import { useTheme } from "next-themes";

// Mock del hook useTheme
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("Header component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders header with light theme and updates image on load", async () => {
    // Tema light
    (useTheme as jest.Mock).mockReturnValue({ theme: "light", resolvedTheme: "light" });

    render(<Header />);

    // Attendi che il componente si monti e l'immagine venga renderizzata
    await waitFor(() => {
      expect(screen.getByAltText("Buddy Logo")).toBeInTheDocument();
    });

    const logo = screen.getByAltText("Buddy Logo");

    // Dovrebbe usare il logo light in caso di tema light
    expect(logo).toHaveAttribute("src", "/buddyLight.png");

    // Prima del caricamento, l'immagine è nascosta
    expect(logo).toHaveClass("hidden");

    // Simula l'evento onLoad dell'immagine
    fireEvent.load(logo);

    // Dopo il caricamento, l'immagine diventa visibile (classe "block")
    expect(logo).toHaveClass("block");
  });

  it("renders header with dark theme and updates image on load", async () => {
    // Tema dark
    (useTheme as jest.Mock).mockReturnValue({ theme: "dark", resolvedTheme: "dark" });

    render(<Header />);

    // Attendi che l'immagine venga renderizzata dopo il montaggio
    await waitFor(() => {
      expect(screen.getByAltText("Buddy Logo")).toBeInTheDocument();
    });

    const logo = screen.getByAltText("Buddy Logo");

    // Dovrebbe usare il logo dark in caso di tema dark
    expect(logo).toHaveAttribute("src", "/buddyDark.png");

    // Simula l'evento onLoad per rendere l'immagine visibile
    fireEvent.load(logo);
    expect(logo).toHaveClass("block");
  });
});
