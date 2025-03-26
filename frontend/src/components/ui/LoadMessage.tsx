import React from "react";

export default function LoadMessage() {
    return (
        <div data-testid="loading-indicator" className="flex items-center h-20 space-x-3 w-fit mr-auto">
            <div className="w-4 h-4 bg-gray-400 dark:bg-gray-200 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce delay-150"></div>
            <div className="w-4 h-4 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce delay-300"></div>
        </div>
    );
}
