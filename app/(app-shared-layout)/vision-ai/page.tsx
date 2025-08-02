"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, SendHorizontal, X, Bot } from "lucide-react";
import Image from "next/image";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SidebarTrigger } from "@/components/ui/sidebar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dynamic = "force-dynamic";

export default function VisionAI() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageContext, setImageContext] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat({
      api: "/api/analyze",
      onFinish: () => {
        setSelectedImage(null);
        setPreviewImage(null);
        setImageContext(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Send the image file to the analyze-image route
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("/api/vision-ai", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setImageContext(data.imageContext);
      } catch (error) {
        console.error("Error analyzing image:", error);
      }
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!imageContext && !input.trim()) return;

    const userMessage = input || "Analyze this image";
    setInput("");

    const formData = {
      messages: [{ role: "user", content: userMessage }],
      imageContext: imageContext,
    };

    handleSubmit(event, { data: formData });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col flex-grow h-svh bg-black/90 text-white px-2 sm:px-4 md:px-28 relative">
      <SidebarTrigger className="fixed top-2 left-2 z-30 p-3 sm:p-5 text-gray-400 hover:text-white transition-colors duration-200 md:absolute md:top-2 md:left-2" />
      
      <header className="flex-shrink-0 p-4 sm:p-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold select-none">
          Vision
          <span className="text-3xl sm:text-4xl md:text-4xl font-bold bg-gradient-to-r from-violet-500 via-blue-500 to-teal-500 bg-clip-text text-transparent">
            AI
          </span>
          {" "}Health Analyzer
        </h1>
      </header>

      <main className="flex-grow overflow-auto px-1 sm:px-4 md:px-6 py-2 sm:py-4 no-scrollbar">
        <div className="space-y-4 flex-grow">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[95vw] sm:max-w-[80%] px-4 sm:px-5 py-2 sm:py-3 rounded-2xl shadow border backdrop-blur-lg ${
                  message.role === "user"
                    ? "bg-[#181b20] border-[#23262b] text-gray-100 font-semibold"
                    : "bg-[#23262b] border-[#23262b] text-gray-200"
                }`}
              >
                {message.role !== "user" && (
                  <div className="flex items-center mb-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-teal-400 to-purple-400 mr-2">
                      <Bot className="h-5 w-5 text-white" />
                    </span>
                    <span className="font-bold text-gray-100">VisionAI</span>
                  </div>
                )}
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ ...props }) => <p className="mb-0 text-gray-300" {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="flex-shrink-0 p-6 bg-transparent">
        <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              className="flex-grow p-3 bg-[#181b20] border border-[#23262b] rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 shadow"
              placeholder="Describe any symptoms or concerns..."
              value={input}
              onChange={handleInputChange}
              aria-label="Vision AI input"
            />

            <label
              htmlFor="image-upload"
              className="flex items-center justify-center p-3 bg-[#181b20] border border-[#23262b] rounded-2xl cursor-pointer hover:bg-[#23262b] transition-colors duration-200 shadow"
            >
              <Upload className="w-5 h-5 text-gray-400" />
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
              className="p-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity duration-200 shadow"
              disabled={!imageContext && !input.trim()}
            >
              <SendHorizontal className="w-5 h-5" />
            </button>
          </div>

          {previewImage && (
            <div className="flex justify-start">
              <div className="relative inline-block bg-[#181b20] border border-[#23262b] rounded-2xl p-2 shadow">
                <Image
                  src={previewImage}
                  alt="Selected"
                  className="h-20 w-auto object-contain rounded-lg"
                  width={80}
                  height={80}
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewImage(null);
                    setImageContext(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      </footer>
    </div>
  );
}
