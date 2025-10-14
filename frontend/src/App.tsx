import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { LoginScreen } from './pages/LoginScreen' // import login screen component
import { RegisterScreen } from './pages/RegisterScreen' // import register screen component
import { api } from './services/api';


type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function App() { // main app function

  const [token, setToken] = useState<string | null>(null); // state to store auth token
  const [showRegister, setShowRegister] = useState(false); // state to toggle between login and register screens

  async function login(email: string, password: string) {
    try {
      const res = await api.post('/login', { email, password });
      console.log("Token:", res.data.token); // browser log test
      setToken(res.data.token);
    } catch (error) { // error handling
      console.error('Login failed', error);
      alert("Falha no Login. Verifique o console")
    }
  }
  async function registerUser(data: RegisterFormData) {
    const loadingToast = toast.loading('Criando sua conta...');

    try {
      // Prepare data to send, excluding confirmPassword
      const submitData = {
        name: data.name,
        email: data.email,
        password: data.password
      };

      await api.post('/register', submitData); ; // send registration data to backend

      toast.success('Cadastro realizado com sucesso! Faça o login.', { id: loadingToast });
      setShowRegister(false); // Volta para a tela de login após o sucesso

    } catch (error) {
      console.error("Falha no cadastro:", error);
      toast.error('Erro ao criar conta. Tente outro email.', { id: loadingToast });
    }
  }

  if (token) { // if token exists, user is logged in
    return (
      <div style={{ padding: 20 }}>
        <h2>Login bem-sucedido!</h2>
      </div>
    );
  }
  return (
    <>
      
      <Toaster position="top-right" />
      {showRegister ? ( // toggle between login and register screens
        <RegisterScreen
          onRegister={registerUser}
          onSwitchToLogin={() => setShowRegister(false)} 
        />
      ) : (
        <LoginScreen // login screen component
          onLogin={login}
          onSwitchToRegister={() => setShowRegister(true)}
        />
      )}
    </>
  );
}
export default App;
