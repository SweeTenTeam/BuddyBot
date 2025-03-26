import React from "react";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

const errorMessages: Record<number, { title: string; message: string }> = {
    404: { title: "Not Found", message: "The requested resource was not found." },
    500: { title: "Server Error", message: "Something went wrong on our end. Please try again later." },
    505: { title: "Answer too long", message: "The answer generated was too long to be handled. Please rephrase your question." },
    506: { title: "No answer", message: "No answer was generated for your question. Please rephrase it." },
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
