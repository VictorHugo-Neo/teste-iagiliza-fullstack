import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { LoginScreen } from "./pages/LoginScreen"; // import login screen component
import { RegisterScreen } from "./pages/RegisterScreen"; // import register screen component
import { ChatScreen } from "./pages/ChatScreen"; // import chat screen component
import { EditProfileScreen } from './pages/EditProfileScreen'; // import edit profile screen component
import { LandingPage } from './pages/LandingPage'; // import landing page component
import { api } from "./services/api";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("authToken")); // state to hold auth token
   // state to toggle between login and register screens
  const [activeScreen, setActiveScreen] = useState<'chat' | 'editProfile'>('chat');
  const [publicView, setPublicView] = useState<'landing' | 'login' | 'register'>('landing');

  async function login(email: string, password: string) {
    try {
      const res = await api.post("/login", { email, password });
      const receivedToken = res.data.token; // get token from response
      localStorage.setItem("authToken", receivedToken); // store token in local storage
      setToken(receivedToken);
    } catch (error) {
      // error handling
      console.error("Login failed", error);
      toast.error("Falha no Login. Verifique suas credenciais.");
    }
  }
  async function registerUser(data: RegisterFormData) {
    const loadingToast = toast.loading("Criando sua conta...");

    try {
      // Prepare data to send, excluding confirmPassword
      const submitData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      await api.post("/register", submitData); // send registration data to backend

      toast.success("Cadastro realizado com sucesso! Faça o login.", {
        id: loadingToast,
      });
      
      setPublicView('login'); 
    } catch (error) {
      console.error("Falha no cadastro:", error);
      toast.error("Erro ao criar conta. Tente outro email.", {
        id: loadingToast,
      });
    }
  }

  // function to handle user logout
  function logout() {
    localStorage.removeItem("authToken"); // remove token from local storage
    setToken(null); // clear token from state
    toast.success("Você foi desconectado.");
  }

  return (
    <>
      {/* Toast notifications container */}
      <Toaster position="top-right" />

      {token ? (
        // If token exists, show authenticated views
        <>
          {activeScreen === 'chat' && (
            <ChatScreen onLogout={logout} onNavigateToEditProfile={() => setActiveScreen('editProfile')} />
          )}
          {activeScreen === 'editProfile' && (
            <EditProfileScreen onLogout={logout} onNavigateToChat={() => setActiveScreen('chat')} />
          )}
        </>
      ) : (
        // If no token, show public views
        <>
          {publicView === 'landing' && (
            <LandingPage 
              onNavigateToLogin={() => setPublicView('login')}
              onNavigateToRegister={() => setPublicView('register')}
            />
          )}
          {publicView === 'login' && (
            <LoginScreen 
              onLogin={login}
              onSwitchToRegister={() => setPublicView('register')}
            />
          )}
          {publicView === 'register' && (
            <RegisterScreen 
              onRegister={registerUser}
              onSwitchToLogin={() => setPublicView('login')}
            />
          )}
        </>
      )}
    </>
  );
}
export default App;