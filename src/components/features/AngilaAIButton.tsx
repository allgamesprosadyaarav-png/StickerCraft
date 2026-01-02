import { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { AngilaAI } from './AngilaAI';

export function AngilaAIButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 group"
        aria-label="Open Angila AI Assistant"
      >
        <div className="relative">
          {/* Animated pulse ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-ping opacity-30" />
          
          {/* Main button */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
            <Bot className="w-8 h-8 text-white" />
          </div>
          
          {/* Online status indicator */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          
          {/* Tooltip */}
          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat with Angila AI 🤖
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900" />
          </div>
        </div>
      </button>

      {isOpen && <AngilaAI onClose={() => setIsOpen(false)} />}
    </>
  );
}
