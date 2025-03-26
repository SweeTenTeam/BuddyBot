"use client"

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="group hover:bg-primary transition-none rounded-full bg-amber-200 dark:bg-blue-900"
      onClick={toggleTheme}
      data-testid="theme-toggle-button"
    >
      {theme === "light" ? (
        <Sun
          className="stroke-amber-600 group-hover:stroke-foreground h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          data-testid="sun-icon"
        />
      ) : (
        <Moon
          className="group-hover:stroke-foreground absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          data-testid="moon-icon"
        />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}