
import { useEffect, useRef } from "react";
import { useChat } from "@/providers/chatProvider";
import ChatQA from "./ChatQA";
import LoadChat from "./ui/LoadChat";
import { Button } from "./ui/button";
import { ErrorAlert } from "./ui/ErrorAlert";

export default function Chat() {
    const { loadHistory, state } = useChat();
    const chatRef = useRef<HTMLDivElement>(null);

    const handleLoadHistory = async () => {
        if (chatRef.current) {
            const previousScrollHeight = chatRef.current.scrollHeight;
            await loadHistory();
            const newScrollHeight = chatRef.current.scrollHeight;
            chatRef.current.scrollTop += (newScrollHeight - previousScrollHeight);
        }
    };

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [state.hasToScroll]);

    return (
        <div ref={chatRef} className="flex flex-col h-full w-full overflow-y-auto overflow-x-hidden" data-testid="chat-component">
            {state.loadingHistory ? (
                <div className="flex flex-col m-auto items-center justify-center w-full p-4">
                    <LoadChat />
                </div>
            ) : (
                <>
                    {state.errorHistory != 0 ? (
                        <div className="w-full h-full flex items-center justify-center" data-testid="error-alert">
                            <ErrorAlert statusCode={state.errorHistory} />
                        </div>
                    ) : (
                        <>
                            {state.hasMore ?
                                <div className="p-4 m-auto flex flex-col w-[10em] h-[5em]">
                                    <Button data-testid="load-more" variant="default" onClick={handleLoadHistory}>Load more</Button>
                                </div>
                                :
                                <div className="flex flex-col m-auto items-center justify-center w-full p-4">
                                    <div className="flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" role="alert">
                                        <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                        </svg>
                                        <span className="sr-only">Info</span>
                                        <div>
                                            <span className="font-medium">Info alert!</span> No more messages to load.
                                        </div>
                                    </div>
                                </div>
                            }
                        </>
                    )
                    }
                </>
            )}
            <ul className="w-full p-4">
                {state.messages.map((msg) => (
                    <li key={msg.id} className=''>
                        <ChatQA
                            key={msg.id}
                            questionAnswer={msg}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
