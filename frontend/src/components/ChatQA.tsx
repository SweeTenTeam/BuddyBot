import React from "react";
import Bubble from "@/components/Bubble";
import { QuestionAnswer } from "@/types/QuestionAnswer";
import MessageAvatar from "./ui/MessageAvatar";

export default function ChatQA({ questionAnswer }: { questionAnswer: QuestionAnswer }) {
    // console.log("chatQA", typeof questionAnswer.lastUpdated);
    return (
        <div className="question-answer">
            {/* User Message */}
            <div className="flex items-end justify-end gap-2">
                <Bubble message={questionAnswer.question} user={true} error={0} loading={false} />
                <span className="mb-4"><MessageAvatar user={true} /></span>
            </div>

            {/* Bot Answer */}
            <div className="flex items-end justify-start gap-2">
                <span className="mb-4"><MessageAvatar user={false} /></span>

                <Bubble
                    message={questionAnswer.answer}
                    user={false}
                    error={questionAnswer.error}
                    loading={questionAnswer.loading}
                    lastUpdated={questionAnswer.lastUpdated}
                />
            </div>
        </div>
    );
} 