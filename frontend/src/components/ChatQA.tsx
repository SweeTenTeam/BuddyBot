import React from "react";
import Bubble from "@/components/Bubble";
import { QuestionAnswer } from "@/types/QuestionAnswer";

export default function ChatQA({ questionAnswer }: { questionAnswer: QuestionAnswer }) {
    return (
        <div className="question-answer">
            <div className="question">
                <Bubble message={questionAnswer.question} user={true} error={0} loading={false} />
            </div>
            <div className="answer">
                <Bubble message={questionAnswer.answer} user={false} error={questionAnswer.error} loading={questionAnswer.loading} />
            </div>
        </div>
    );
}