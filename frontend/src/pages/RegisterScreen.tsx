import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod'; // library for schema validation
import { zodResolver } from '@hookform/resolvers/zod';


// Validetion schema using Zod
const registerSchema = z.object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
    email: z.string().email('Por favor, insira um email válido.'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, { // custom validation to check if passwords match
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
});

// Infer the form data type from the schema
type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterScreenProps {
    onRegister: (data: RegisterFormData) => void; // Função que receberá os dados válidos
    onSwitchToLogin: () => void;
}
export function RegisterScreen({ onRegister }: RegisterScreenProps) { // Main Register Screen component

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    });

    const handleRegister: SubmitHandler<RegisterFormData> = (data) => {
        onRegister(data); // Call the onRegister prop with valid data
    };

    return ( // Page layout with Header, main form, and Footer
        <div className="flex flex-col min-h-screen bg-light text-light">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="bg-secondary w-full max-w-md p-8 rounded-lg shadow-xl">
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
                            {errors.name && <p className="text-danger mt-1 text-sm">{errors.name.message}</p>} {/* Display validation error for name */}
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

                        <div>
                            <input
                                type="password"
                                placeholder="Digite sua senha"
                                {...register('password')}
                                className="w-full px-4 py-2 text-dark bg-light rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                            {errors.password && <p className="text-danger mt-1 text-sm">{errors.password.message}</p>}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Confirme sua senha"
                                {...register('confirmPassword')} // Register the confirmPassword field
                                className="w-full px-4 py-2 text-dark bg-light rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                            {errors.confirmPassword && <p className="text-danger mt-1 text-sm">{errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-light text-secondary font-bold p-3 rounded-md mt-4 hover:bg-primary  hover:text-light transition-colors"
                        >
                            CRIAR CONTA
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}