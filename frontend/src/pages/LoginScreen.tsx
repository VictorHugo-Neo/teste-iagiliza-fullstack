import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface LoginScreenProps {
    onLogin: (email: string, password: string) => void;
    onSwitchToRegister: () => void;
}
// LoginScreen component with email and password inputs
export function LoginScreen({ onLogin, onSwitchToRegister }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginClick = () => {
        onLogin(email, password);
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent form submission 
        handleLoginClick();
    };
    return (
        <div className="flex flex-col min-h-screen bg-light">
            <Header
                variant="public-login"
                onNavigateToRegister={onSwitchToRegister}
            />
            <main className="flex-grow flex items-center justify-center p-4">
                {/* Login form container */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-sm"
                >
                    <h2 className="text-3xl font-bold text-light text-center mb-6">
                        LOGIN
                    </h2>

                    <div className="space-y-4">
                        {/* Email input field */}
                        <input
                            className="w-full px-4 py-2 text-dark bg-light rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                            placeholder='Digite seu email'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {/* Password input field */}
                        <input
                            className="w-full px-4 py-2 text-dark bg-light rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                            placeholder='Digite sua senha'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-6 px-4 py-2 font-bold text-secondary bg-light rounded-md hover:bg-gray-200 transition-colors"
                    >
                        ENTRAR
                    </button>
                    <p>Não tem uma conta?
                        <button
                            type="button"
                            onClick={onSwitchToRegister} // Switch to registration screen
                            className="text-primary hover:underline"
                        >
                            Cadastre-se
                        </button>
                    </p>
                </form>
            </main>
            <Footer /> {/* Footer component */}
        </div>
    );
}