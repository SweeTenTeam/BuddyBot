import React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import "./globals.css";


export const metadata: Metadata = {
  title: "BuddyBot",
  description: "Il tuo assistente virtuale preferito",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="pl-5 pr-5 h-dvh flex flex-col m-auto max-w-[1040px]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider >
      </body>
    </html>
  );
}
