"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Message, useChat } from "ai/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, SendHorizontal, StopCircle } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { SidebarTrigger } from "@/components/ui/sidebar";

const LOCAL_STORAGE_KEY = "chatMessageHistory";

function ErrorFallback({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#343541] text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
      <p className="mb-4">
        We&apos;re sorry, but we encountered an error. Please try again later.
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-[#10a37f] rounded-md text-white hover:bg-[#0d8c6d]"
      >
        Try again
      </button>
    </div>
  );
}

export default function ChatWrapper() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Chat />
    </ErrorBoundary>
  );
}

function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);

  const loadMessagesFromLocalStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHistory) {
        try {
          return JSON.parse(storedHistory) as Message[];
        } catch (e) {
          console.error("Error parsing stored chat history:", e);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
    }
    return [];
  }, []);

  const saveMessagesToLocalStorage = useCallback((messages: Message[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    }
  }, []);

  useEffect(() => {
    setInitialMessages(loadMessagesFromLocalStorage());
  }, [loadMessagesFromLocalStorage]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    stop,
    isLoading,
    error,
  } = useChat({
    initialMessages,
    onError: (e) => {
      console.error("Chat error:", e);
      setErrorMessage(
        "An error occurred while processing your request. Please try again." +
          error
      );
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      saveMessagesToLocalStorage(messages);
    }
  }, [messages, saveMessagesToLocalStorage]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col flex-grow h-svh bg-[#343541] text-white md:px-28 relative">
      <SidebarTrigger className="absolute top-2 left-2 p-5" />
      <header className="flex-shrink-0 p-4 text-center">
        <h1 className="text-2xl md:text-4xl font-bold select-none">Vitae<span className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent ">AI</span></h1>
      </header>
      <main className="flex-grow overflow-auto p-4 no-scrollbar">
        {errorMessage && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        <div className="space-y-4 flex-grow">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  m.role === "user"
                    ? "bg-[#5c5c72]"
                    : "bg-[#444654] py-6 max-w-full md:max-w-[80%]"
                }`}
              >
                {m.role !== "user" && (
                  <div className="flex items-center mb-2">
                    <div className="rounded-sm bg-[#10a37f] h-8 w-8 flex items-center justify-center mr-2">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold">AI Assistant</span>
                  </div>
                )}
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ ...props }) => <p className="mb-0" {...props} />,
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <footer className="flex-shrink-0 p-4">
        <form
          onSubmit={handleFormSubmit}
          className="flex items-center space-x-2"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question..."
            className="flex-grow p-2 bg-[#40414f] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10a37f]"
            aria-label="Chat input"
          />
          {isLoading ? (
            <button
              onClick={stop}
              className="p-2 bg-[#10a37f] rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <StopCircle className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={input.trim().length <= 2 || isLoading}
              className="p-2 bg-[#10a37f] rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendHorizontal className="h-5 w-5" />
            </button>
          )}
        </form>
      </footer>
    </div>
  );
}
