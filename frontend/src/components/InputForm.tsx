import React from "react";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@/providers/chatProvider";
import { Send } from "lucide-react";

const MAX_CHARS = 10000;

export default function InputForm() {
  const { sendMessage } = useChat();
  const [text, setText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    setText("");
    setCharCount(0);
    setHasError(false);
    if (text.trim() === "" || text==="`" || text==="´") return;
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "auto";
    }
    await sendMessage(text);
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    if (content.length <= MAX_CHARS) {
      setHasError(false);
      setText(content);
      setCharCount(content.length);
      adjustHeight();
    } else {
      setHasError(true);
      event.target.value = content.substring(0, MAX_CHARS);
    }
  };




  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const pasteContent = event.clipboardData.getData("text");
    const cursorPosition = textareaRef.current?.selectionStart || 0;
    const newText = (text.slice(0, cursorPosition) + pasteContent + text.slice(cursorPosition));
    setHasError(newText.length > MAX_CHARS);
    const finalText = newText.substring(0, MAX_CHARS)
    setText(finalText);
    setCharCount(finalText.length);
    if (textareaRef.current) {
      textareaRef.current.value = finalText;
      textareaRef.current.selectionStart = cursorPosition + pasteContent.length;
      textareaRef.current.selectionEnd = cursorPosition + pasteContent.length;
      adjustHeight();
    }
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 20 * 24)}px`;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(event as unknown as React.FormEvent);
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  return (
    <form onSubmit={handleSendMessage} className="flex justify-center items-center w-full p-4 bg-input relative bottom-0 left-0 gap-2" data-testid="input-form">
      <label htmlFor="message" className="hidden">Message</label>

      <div className="bg-gray-400 dark:bg-gray-700/50 flex flex-col w-full h-full rounded-xl">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className="w-full min-w-20 m-0 mt-0 mb-0 items-center resize-none border-none text-left rounded-[12px] leading-[1.2em] focus:outline-none overflow-y-auto max-h-[15em] p-[0.6em] whitespace-pre-wrap"
          rows={1}
          placeholder="Type a message..."
        />
        <div className="flex relative justify-between items-end p-2">
          <div className={hasError ? "text-red-500 animate-bounce" : "text-foreground/50"}>
            {hasError ? <p>{charCount} / {MAX_CHARS} LIMIT REACHED</p> :
              <p>{charCount} / {MAX_CHARS}</p>
            }
          </div>
          <button
            type="submit"
            className="group bg-white text-black border-none flex items-center justify-center cursor-pointer rounded-[12px] hover:bg-ring p-2 pl-[0.45em] pb-[0.45em]"
            value="Send"
          >
            <Send className="group-hover:stroke-white" />
          </button>
        </div>
      </div>
    </form>
  );
}
