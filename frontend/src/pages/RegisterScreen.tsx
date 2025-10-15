import { useState } from 'react'; // 1. Importar useState
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// 2. Importar os ícones da biblioteca Heroicons
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const registerSchema = z.object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
    email: z.string().email('Por favor, insira um email válido.'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterScreenProps {
    onRegister: (data: RegisterFormData) => void;
    onSwitchToLogin: () => void;
    onBackToLanding?: () => void; // Adicionar para a navegação completa
}

export function RegisterScreen({ onRegister, onSwitchToLogin, onBackToLanding }: RegisterScreenProps) {

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    });

    // 3. Adicionar estado para controlar a visibilidade da senha
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister: SubmitHandler<RegisterFormData> = (data) => {
        onRegister(data);
    };

    return (
        <div className="flex flex-col min-h-screen bg-light text-light">
            <Header variant="public-register" onNavigateToLogin={onSwitchToLogin} />
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="bg-secondary w-full max-w-md p-8 rounded-lg shadow-xl">
                    {onBackToLanding && (
                        <button type="button" onClick={onBackToLanding} className="text-light hover:underline mb-4">
                            &larr; Voltar para a página inicial
                        </button>
                    )}
                    <h2 className="text-light text-3xl font-bold text-center mb-6">
                        CADASTRO
                    </h2>
                    <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Digite seu nome"
                                {...register('name')}
                                className="w-full px-4 py-2 text-dark bg-light rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                            {errors.name && <p className="text-danger mt-1 text-sm">{errors.name.message}</p>}
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Digite seu email"
                                {...register('email')}
                                className="w-full px-4 py-2 text-dark bg-light rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                            {errors.email && <p className="text-danger mt-1 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* 4. Envolver o campo de senha para adicionar o botão */}
                        <div className="relative">
                            <input
                                // O tipo do input agora é dinâmico
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Digite sua senha"
                                {...register('password')}
                                className="w-full px-4 py-2 text-dark bg-light rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 pr-10"
                            />
                            {/* Botão de visualização */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-800"
                                aria-label={showPassword ? "Ocultar senhas" : "Mostrar senhas"}
                            >
                                {showPassword ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-danger mt-1 text-sm">{errors.password.message}</p>}

                        {/* 5. Fazer o mesmo para o campo de confirmação de senha */}
                        <div className="relative">
                             <input
                                // O tipo também é dinâmico
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirme sua senha"
                                {...register('confirmPassword')}
                                className="w-full px-4 py-2 text-dark bg-light rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-800"
                                aria-label={showPassword ? "Ocultar senhas" : "Mostrar senhas"}
                            >
                                {showPassword ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-danger mt-1 text-sm">{errors.confirmPassword.message}</p>}
                        
                        <button
                            type="submit"
                            className="w-full bg-light text-secondary font-bold p-3 rounded-md mt-4 hover:bg-primary hover:text-light transition-colors"
                        >
                            CRIAR CONTA
                        </button>
                    </form>
                </div>
            </main>
            <Footer/>
        </div>
    );
}