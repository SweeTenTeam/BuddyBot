import React from "react";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

const errorMessages: Record<number, { title: string; message: string }> = {
    400: { title: "Connection Error", message: "An error occurred while connecting to the server to fetch history." },
    401: { title: "Connection Error", message: "An error occurred while connecting to the server to send the message." },
    408: { title: "Timeout", message: "The request took too long to fetch the history." },
    409: { title: "Timeout", message: "The request took too long to get an answer for the question." },
    500: { title: "Server Error", message: "An internal server error occurred while fetching history. Please try again later." },
    501: { title: "Server Error", message: "An internal server error occurred while sending the message. Please try again later." },
    1: { title: "Answer Too Long", message: "The generated answer was too long to process. Please rephrase your question." },
};

export function ErrorAlert({ statusCode }: { statusCode: number }) {
    const errorData = errorMessages[statusCode] || {
        title: "Unknown Error",
        message: "An unexpected error occurred."
    };

    const [timestamp, setTimestamp] = useState("");

    useEffect(() => {
        setTimestamp(new Date().toLocaleTimeString());
    }, []);

    return (
        <Alert variant="destructive" className="border-2 border-red-500 bg-red-500/80 dark:bg-red-500/50 m-auto p-4 w-[90%]">
            <AlertCircle className="h-8 w-8 flex flex-col items-center" />
            <AlertTitle>{errorData.title}</AlertTitle>
            <AlertDescription>
                <p>{errorData.message}</p>
                <p className="text-sm opacity-70">{timestamp}</p>
            </AlertDescription>
        </Alert>
    );
}
