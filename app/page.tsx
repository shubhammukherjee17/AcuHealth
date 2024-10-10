"use client";
import { FaStop } from "react-icons/fa";
import { FaFirstAid } from "react-icons/fa";
import { useChat } from "ai/react";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    stop,
    isLoading,
    error,
  } = useChat({
    onError: (e) => {
      console.log(e);
    },
  });
  return (
    <div className=" w-full min-h-svh max-w-4xl py-10 mx-auto relative">
      <h1 className="text-2xl md:text-4xl font-bold text-center text-white">
        AI Health Assistant
      </h1>
      {error ? (
        <div className="text-red-500 text-center">{JSON.stringify(error)}</div>
      ) : (
        ""
      )}
      <div className="flex flex-col px-5 stretch gap-5 py-24">
        {messages.map((m, idx) => (
          <div
            key={m.id}
            className={`whitespace-pre-wrap px-6 py-2 rounded-full ${
              m.role === "user" ? "self-end bg-[#343541] md:w-1/2" : "md:w-3/4"
            }`}
          >
            <div className="flex">
              {m.role != "user" ? (
                <div className="grow rounded-full border h-10 w-10 text-sm p-2 font-bold flex items-center justify-center mx-2">
                  <FaFirstAid size={25} />
                </div>
              ) : (
                ""
              )}
              <div className="px-4 py-2">
                {m.content}
                {isLoading &&
                m.role != "user" &&
                idx === messages.length - 1 ? (
                  <div className="bg-gray-800 h-5 w-5 animate-pulse inline-block rounded-full"></div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full md:max-w-4xl mx-auto flex fixed bottom-0 p-2"
      >
        <input
          className="w-full py-4 px-6 mb-2 outline-none rounded-full bg-[#343541] shadow-md"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
        {isLoading ? (
          <button
            onClick={stop}
            className="bg-[#202123] p-3 rounded-full absolute right-5 bottom-[50%] translate-y-[40%]"
          >
            <FaStop />
          </button>
        ) : (
          ""
        )}
      </form>
    </div>
  );
}
