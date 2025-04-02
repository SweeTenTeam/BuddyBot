import React, { useState, useEffect } from "react";
import { Message } from "@/types/Message";
import { formatDate } from "@/utils/formatDate";
import { ErrorAlert } from "./ui/ErrorAlert";
import LoadMessage from "./ui/LoadMessage";
import MessageAvatar from "./ui/MessageAvatar";
import MarkDown from "./ui/MarkDown";


export default function Bubble({ message, user, error, loading, lastUpdated }: { message: Message, user: boolean, error: number, loading: boolean, lastUpdated?: string }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia("(hover: none)").matches);
        };

        checkMobile(); // Check on mount
        window.addEventListener("resize", checkMobile); // Update on resize

        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    if (error != 0 || message.timestamp == undefined || (!user && lastUpdated == undefined)) {
        return (
            <div id="error-message">
                <ErrorAlert statusCode={error} />
            </div>
        );
    }

    const isUser = user
        ? "ml-auto bg-popover dark:bg-muted-foreground rounded-br-none flex justify-end"
        : "mr-auto bg-chart-1 rounded-bl-none flex justify-start";

    const parsedTimestamp: number = Date.parse(message.timestamp);
    const parsedUpdate: number = Date.parse(lastUpdated || "");
    return (
        <>
            {!user && loading ? (
                <div className="mr-auto mt-4 mb-4">
                    <LoadMessage />
                </div>
            ) : (
                <>
                    <div className={`p-4 rounded-2xl mt-4 mb-4 max-w-[90%] sm:max-w-[70%] md:max-w-[40%] w-full break-words flex flex-col ${isUser}`}>
                        {!user ?
                            <>
                                <MarkDown content={message.content} />
                                <div className="flex items-center justify-between mt-2">
                                    <div className="group relative flex items-center">
                                        <svg
                                            className="shrink-0 inline w-4 h-4 me-3 hover:scale-125"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            onClick={() => isMobile && setIsVisible(!isVisible)} // Only toggle on mobile
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 1 1 1 1v4h1a1 1 0 1 1 0 2Z" />
                                        </svg>

                                        {/* Tooltip - Hover for desktop, Click for mobile */}
                                        <div
                                            className={`absolute left-0 rounded-sm w-max top-full mt-1 max-w-xs bg-accent p-2 text-sm text-left shadow-md ${isMobile ? (isVisible ? "block" : "hidden") : "hidden group-hover:block"}`}
                                        >

                                            <p className="italic underline">Last Updated: {formatDate(parsedUpdate)}</p>

                                            {/* <p className="">Information were last updated on <span className="italic bold underline">{formatDate(parsedUpdate)}</span>. To have more information on how they were retrieved, check our <a className="underline" href="link">documentation</a> </p> */}
                                        </div>
                                    </div>

                                    <p className="text-sm opacity-80 text-right">{formatDate(parsedTimestamp)}</p>
                                </div>
                            </>
                            : (
                                <>
                                    <p className="w-full h-full whitespace-pre-line">{message.content}</p>
                                    <p className="text-sm opacity-80 text-right">{formatDate(parsedTimestamp)}</p>
                                </>
                            )}
                    </div>
                </>
            )
            }
        </>
    );
}
