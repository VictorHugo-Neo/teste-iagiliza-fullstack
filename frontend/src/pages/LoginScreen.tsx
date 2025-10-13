import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = () => {
    // Adicione validações aqui se necessário (ex: if (!email || !password) return;)
    onLogin(email, password);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4">
            <div style={{ padding: 20}}>
                <h2>Login</h2>
                <input
                    placeholder='Email'
                    value ={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <input
                    placeholder='Senha'
                    type = 'password'
                    value = {password}
                    onChange ={(e) => setPassword(e.target.value)}
                />
                <br />
                <button onClick={handleLoginClick}>Entrar</button>
            </div>
      </main>

      <Footer />
    </div>
  );
}