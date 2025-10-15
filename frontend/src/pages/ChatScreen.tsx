import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ChatWindow } from "../components/Chat/ChatWindow";

type ChatScreenProps = { // eslint-disable-line no-unused-vars
  onLogout: () => void;
  onNavigateToEditProfile: () => void;
};

export function ChatScreen({ onLogout, onNavigateToEditProfile }: ChatScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-light text-dark">
      <Header
        variant="private-chat"
        onLogout={onLogout}
        onNavigateToEditProfile={onNavigateToEditProfile}
      />
      <main className="flex-grow flex items-center justify-center p-4">
        <ChatWindow /> {/* ChatWindow component */}
      </main>
      <Footer />
    </div>
  );
}