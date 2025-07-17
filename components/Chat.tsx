"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Message, useChat } from "ai/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, SendHorizontal, StopCircle } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
// import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

function ErrorFallback({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-[#343541] text-white p-4">
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
interface ChatProps {
  chatId?: string;
}

function Chat({ chatId: initialChatId }: ChatProps) {
  const { user } = useAuth();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chatId, setChatId] = useState<string | null>(initialChatId || null);
  const LOCAL_STORAGE_KEY = chatId!;
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
  }, [LOCAL_STORAGE_KEY]);

  const saveMessagesToLocalStorage = useCallback(
    (messages: Message[]) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
      }
    },
    [LOCAL_STORAGE_KEY]
  );

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (chatId) {
        const chatRef = doc(db, "chathistory", chatId);
        const chatDoc = await getDoc(chatRef);
        if (chatDoc.exists()) {
          setInitialMessages(chatDoc.data().messages || []);
        } else {
          setInitialMessages([]);
        }
      } else {
        setInitialMessages(loadMessagesFromLocalStorage());
      }
    };
    loadInitialMessages();
  }, [chatId, loadMessagesFromLocalStorage]);

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
    const saveToFirestore = async () => {
      if (user && messages.length > 0) {
        try {
          const currentChatId = chatId!;
          if (messages.length === 4) {
            const title = messages[3].content.substring(0, 50);
            const chatRef = doc(collection(db, "chathistory"), currentChatId);
            await setDoc(
              chatRef,
              {
                messages: messages.map((m) => ({
                  id: m.id,
                  content: m.content,
                  role: m.role,
                })),
                title,
                userId: user.uid,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } else {
            // Update existing chat document
            const chatRef = doc(collection(db, "chathistory"), currentChatId);
            await setDoc(
              chatRef,
              {
                messages: messages.map((m) => ({
                  id: m.id,
                  content: m.content,
                  role: m.role,
                })),
                userId: user.uid,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          }
        } catch (error) {
          console.error("Error saving chat to Firestore:", error);
        }
      }
    };

    saveToFirestore();
    saveMessagesToLocalStorage(messages);
  }, [messages, user, chatId, saveMessagesToLocalStorage, router]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col flex-grow h-svh bg-black/90 text-white px-2 sm:px-4 md:px-28 relative">
      <SidebarTrigger className="fixed top-2 left-2 z-30 p-3 sm:p-5 text-gray-400 hover:text-white transition-colors duration-200 md:absolute md:top-2 md:left-2" />
      <header className="flex-shrink-0 p-4 sm:p-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold select-none">
          Acu
          <span className="text-3xl sm:text-4xl md:text-4xl font-bold bg-gradient-to-r from-violet-500 via-blue-500 to-teal-500 bg-clip-text text-transparent">
            Health
          </span>
        </h1>
      </header>
      <main className="flex-grow overflow-auto px-1 sm:px-4 md:px-6 py-2 sm:py-4 no-scrollbar">
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-4 backdrop-blur-sm">
            {errorMessage}
          </div>
        )}
        <div className="space-y-4 flex-grow">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[95vw] sm:max-w-[80%] px-4 sm:px-5 py-2 sm:py-3 rounded-2xl shadow border backdrop-blur-lg ${
                  m.role === "user"
                    ? "bg-[#181b20] border-[#23262b] text-gray-100 font-semibold"
                    : "bg-[#23262b] border-[#23262b] text-gray-200"
                }`}
              >
                {m.role !== "user" && (
                  <div className="flex items-center mb-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-teal-400 to-purple-400 mr-2">
                      <Bot className="h-5 w-5 text-white" />
                    </span>
                    <span className="font-bold text-gray-100">AI Assistant</span>
                  </div>
                )}
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ ...props }) => <p className="mb-0 text-gray-300" {...props} />,
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
      <footer className="flex-shrink-0 p-6 bg-transparent">
        <form
          onSubmit={handleFormSubmit}
          className="flex items-center gap-3 max-w-4xl mx-auto"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question..."
            className="flex-grow p-3 bg-[#181b20] border border-[#23262b] rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 shadow"
            aria-label="Chat input"
          />
          {isLoading ? (
            <button
              onClick={stop}
              className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity duration-200 shadow"
            >
              <StopCircle className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={input.trim().length <= 2 || isLoading}
              className="p-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity duration-200 shadow"
            >
              <SendHorizontal className="h-5 w-5" />
            </button>
          )}
        </form>
      </footer>
    </div>
  );
}

export default function ChatWrapper({ chatId }: ChatProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Chat chatId={chatId} />
    </ErrorBoundary>
  );
}
