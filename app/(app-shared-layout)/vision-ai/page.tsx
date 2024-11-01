"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Send, X, Bot } from "lucide-react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export default function VisionAI() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [context, setContext] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedImage && !context.trim()) return;

    const newUserMessage: Message = {
      id: Date.now(),
      role: "user",
      content: context || "Image uploaded for analysis",
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setContext("");

    // Simulating AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now(),
        role: "assistant",
        content:
          "I've analyzed the image you provided. This is a placeholder response. In a real application, I would provide detailed health insights based on the image and context you've shared.",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-stone-900 text-white w-full">
      <header className=" p-4">
        <h1 className="text-2xl md:text-4xl font-bold text-center">
          Vision<span className="text-yellow-300">AI</span> Health Analyzer
        </h1>
      </header>

      <main className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              <div className="flex items-center">
                {message.role === "user" ? (
                  null
                ) : (
                  <Bot className="h-5 w-5 mr-2" />
                )}
                <span className="font-semibold">
                  {message.role === "user" ? "" : "AI Assistant"}
                </span>
              </div>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>

      <footer className=" p-4 w-full md:w-3/4 mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-grow space-y-2">
            <input
              type="text"
              className="w-full px-3 py-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe any symptoms or concerns..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          <label
            htmlFor="image-upload"
            className="flex items-center justify-center p-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
          >
            <Upload className="w-6 h-6" />
            <input
              id="image-upload"
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
              ref={fileInputRef}
            />
          </label>

          <button
            type="submit"
            className="flex items-center justify-center p-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedImage && !context.trim()}
          >
            <Send className="w-6 h-6" />
          </button>
        </form>

        {selectedImage && (
          <div className="mt-2 relative inline-block">
            <img
              src={selectedImage}
              alt="Selected"
              className="h-20 w-auto object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
