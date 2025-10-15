import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';
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
const ProtectedRoute = ({ token }: { token: string | null }) => {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />; // <Outlet /> renderiza o componente filho da rota (Chat ou Perfil)
};
function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("authToken")); // state to hold auth token
  const navigate = useNavigate();
  // state to toggle between login and register screens
  

  async function login(email: string, password: string) {
    try {
      const res = await api.post("/login", { email, password });
      const receivedToken = res.data.token; // get token from response
      localStorage.setItem("authToken", receivedToken); // store token in local storage
      setToken(receivedToken);
      navigate('/chat'); // navigate to chat screen
      toast.success("Login bem-sucedido!");
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

      navigate('/login'); // navigate to login screen after successful registration
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
    navigate('/'); // navigate to landing page
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* --- Rotas Públicas --- */}
        <Route path="/" element={<LandingPage onNavigateToLogin={() => navigate('/login')} onNavigateToRegister={() => navigate('/register')} />} />
        <Route path="/login" element={<LoginScreen onLogin={login} onSwitchToRegister={() => navigate('/register')} onBackToLanding={() => navigate('/')} />} />
        <Route path="/register" element={<RegisterScreen onRegister={registerUser} onSwitchToLogin={() => navigate('/login')} onBackToLanding={() => navigate('/')} />} />

        {/* --- Rotas Privadas (Protegidas) --- */}
        <Route element={<ProtectedRoute token={token} />}>
          <Route path="/chat" element={<ChatScreen onLogout={logout} onNavigateToEditProfile={() => navigate('/profile')} />} />
          <Route path="/profile" element={<EditProfileScreen onLogout={logout} onNavigateToChat={() => navigate('/chat')} />} />
        </Route>
      </Routes>
    </>
  );
}
export default App;