// src/components/Chat/ChatWindow.tsx

import { useEffect, useState } from "react";
import { api } from "../../services/api";

interface Message { // Define the structure of a message
  id: number;
  content: string;
  fromIA: boolean; // True if the message is from the AI, false if from the user
  createdAt: string; // Timestamp of when the message was created
}

export function ChatWindow() { 
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { // Fetch messages from the backend API
    async function fetchMessages() {
      try {
        const response = await api.get<Message[]>('/messages');
        setMessages(response.data);
      } catch (error) {
        console.error("Falha ao buscar mensagens:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMessages();
  }, []);

  return ( // Chat window layout
    <div className="w-full max-w-3xl h-[70vh] flex flex-col bg-[#343541] rounded-lg shadow-xl overflow-hidden">
      <header className="bg-[#FF7A00] p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-900 rounded-full"></div>
      </header>
      <main className="flex-1 p-6 space-y-4 overflow-y-auto">
        {/* Display loading state or messages */}
        {isLoading ? (
          <div className="flex justify-center items-center h-full"><p>Carregando histórico...</p></div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.fromIA ? 'justify-start' : 'justify-end'}`}>
              <div className={`p-3 rounded-lg max-w-xs ${message.fromIA ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white'}`}>
                {message.content}
              </div>
            </div>
          ))
        )}
      </main>
      <footer className="p-4 bg-[#40414F]">
        <div className="flex items-center bg-white rounded-full px-2">
          <input
            type="text"
            placeholder="Digite sua mensagem"
            className="flex-1 p-3 bg-transparent focus:outline-none text-gray-700"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)} // Update newMessage state on input change
          />
          <button className="bg-[#FF7A00] w-10 h-10 rounded-full flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"> {/* Paper airplane icon */}
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /> {/* SVG path for the icon */}
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}