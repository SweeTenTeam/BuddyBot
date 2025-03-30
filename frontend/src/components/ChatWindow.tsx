"use client"

import React from "react";
import InputForm from './InputForm';
import { ChatProvider } from "@/providers/chatProvider";
import { Adapter } from "@/adapters/Adapter";
import Chat from './Chat';
import { Target } from "@/adapters/Target";

export default function ChatWindow() {
    const adapter: Target = new Adapter();

    return (
        <ChatProvider adapter={adapter}>
            <div data-testid="chat-window" id='chat-window' className="mt-4 mb-4 m-auto h-full w-full flex flex-col items-center justify-between bg-secondary rounded-[20px] overflow-hidden relative">
                <Chat />
                <InputForm />
            </div>
        </ChatProvider>
    );
};
