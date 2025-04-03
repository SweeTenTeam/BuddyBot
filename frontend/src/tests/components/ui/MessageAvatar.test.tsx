import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MessageAvatar from "@/components/ui/MessageAvatar";

jest.mock("@radix-ui/react-avatar", () => {
  return {
    __esModule: true,
    Root: ({ children, ...props }: { children: React.ReactNode }) => (
      <div data-testid="avatar-root" {...props}>
        {children}
      </div>
    ),
    Image: (props: React.ComponentProps<"img">) => (
      <img data-testid="avatar-image" {...props} />
    ),
    Fallback: (props: React.ComponentProps<"div">) => (
      <div data-testid="avatar-fallback" style={{ display: "none" }} {...props} />
    ),
  };
});

describe("MessageAvatar component", () => {
  it("renders User Avatar correctly", () => {
    render(<MessageAvatar user={true} />);

    const image = screen.getByTestId("avatar-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/AD_favicon.png");
    expect(image).toHaveAttribute("alt", "User Avatar");

    const fallback = screen.getByTestId("avatar-fallback");
    expect(fallback).not.toBeVisible();
  });

  it("renders Bot Avatar correctly", () => {
    render(<MessageAvatar user={false} />);

    const image = screen.getByTestId("avatar-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/buddy_avatar.png");
    expect(image).toHaveAttribute("alt", "Bot Avatar");

    const fallback = screen.getByTestId("avatar-fallback");
    expect(fallback).not.toBeVisible();
  });
});
