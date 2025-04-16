import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

beforeAll(() => {
  Object.defineProperty(global.Image.prototype, 'src', {
    set() {
      setTimeout(() => this.onload?.(), 100);
    },
  });
});

describe("Avatar component", () => {
  it("renders Avatar component correctly", () => {
    render(<Avatar data-testid="avatar" />);
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  it("renders AvatarImage when provided", async () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User Avatar" />
      </Avatar>
    );

    const image = await screen.findByTestId("avatar-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("renders AvatarFallback when image is missing", () => {
    render(
      <Avatar>
        <AvatarFallback data-testid="avatar-fallback">AB</AvatarFallback>
      </Avatar>
    );

    const fallback = screen.getByTestId("avatar-fallback");
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveTextContent("AB");
  });
});
