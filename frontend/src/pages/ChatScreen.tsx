import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ChatWindow } from "../components/Chat/ChatWindow"; 

type ChatScreenProps = { // eslint-disable-line no-unused-vars
  onLogout: () => void;
};

export function ChatScreen({ onLogout }: ChatScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-dark text-light">
      <Header onLogout={onLogout} /> {/* Header component with logout functionality */}
      <main className="flex-grow flex items-center justify-center p-4">
        <ChatWindow /> {/* ChatWindow component */}
      </main>
      <Footer />
    </div>
  );
}