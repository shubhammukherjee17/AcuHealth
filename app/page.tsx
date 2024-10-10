'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-6xl py-24 mx-auto stretch gap-5">
      {messages.map(m => (
        <div key={m.id} className={`whitespace-pre-wrap md:w-1/2 px-6 py-6 bg-gray-50 rounded ${m.role === 'user' ? 'self-end':''}`}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit} className='w-full'>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}