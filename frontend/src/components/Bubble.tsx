import React, { useState } from "react";
import { Message } from "@/types/Message";
import { formatDate } from "@/utils/formatDate";
import { ErrorAlert } from "./ui/ErrorAlert";
import LoadMessage from "./ui/LoadMessage";
import MarkDown from "./ui/MarkDown";


export default function Bubble({ message, user, error, loading }: { message: Message, user: boolean, error: boolean, loading: boolean }) {

    if (error) {
        return (
            <div id="error-message">
                <ErrorAlert statusCode={506} />
            </div>
        );
    }

    const isUser = user
        ? "ml-auto bg-popover dark:bg-muted-foreground rounded-br-none flex justify-end"
        : "mr-auto bg-chart-1 rounded-bl-none flex justify-start";

    const parsedTimestamp: number = Date.parse(message.timestamp);
    return (
        <>
            {!user && loading ? (
                <div className="mr-auto mt-4 mb-4">
                    <LoadMessage />
                </div>
            ) : (
                <div className={`p-4 w-fit rounded-2xl mt-4 mb-4 max-w-[70%] break-words flex flex-col ${isUser}`}>
                    {!user ? (
                        <MarkDown content={message.content} />
                    ) : (
                        <p className="w-full h-full whitespace-pre-line">{message.content}</p>
                    )}

                    <p className="text-sm opacity-80 text-right">{formatDate(parsedTimestamp)}</p>
                </div>
            )}
        </>
    );
}
