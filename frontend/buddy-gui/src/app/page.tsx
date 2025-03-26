import React from "react";
import ChatWindow from "@/components/ChatWindow";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";


export default function Home() {

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center h-screen overflow-hidden">
        <Navbar />
        <ChatWindow />
      </main>
    </>
  );
}
