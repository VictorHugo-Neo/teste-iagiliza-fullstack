import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'; // import eye icons

interface LoginScreenProps {
    onLogin: (email: string, password: string) => void;
    onSwitchToRegister: () => void;
    onBackToLanding?: () => void;
}

export function LoginScreen({ onLogin, onSwitchToRegister, onBackToLanding }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="flex flex-col min-h-screen bg-light">
            <Header
                variant="public-login"
                onNavigateToRegister={onSwitchToRegister}
            />
            <main className="flex-grow flex items-center justify-center p-4">
                <form
                    onSubmit={handleSubmit}
                    className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-sm"
                >
                    {onBackToLanding && (
                         <button type="button" onClick={onBackToLanding} className="text-light hover:underline mb-4">
                            &larr; Voltar para a página inicial
                         </button>
                    )}

                    <h2 className="text-3xl font-bold text-light text-center mb-6">
                        LOGIN
                    </h2>

                    <div className="space-y-4">
                        <input
                            className="w-full px-4 py-2 text-dark bg-light rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                            placeholder='Digite seu email'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="relative w-full">
                            <input
                                className="w-full px-4 py-2 text-dark bg-light rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 pr-10"
                                placeholder='Digite sua senha'
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-800"
                                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {/* Toggle between eye and eye-slash icons */}
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-lightText" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-lightText" />
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-6 px-4 py-2 font-bold text-secondary bg-light rounded-md hover:bg-gray-200 transition-colors"
                    >
                        ENTRAR
                    </button>
                    <p className="text-center text-light mt-4">Não tem uma conta?
                        <button
                            type="button"
                            onClick={onSwitchToRegister}
                            className="text-light hover:underline hover:font-bold ml-1"
                        >
                            Cadastre-se
                        </button>
                    </p>
                </form>
            </main>
            <Footer />
        </div>
    );
}