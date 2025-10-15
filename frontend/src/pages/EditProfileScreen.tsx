import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import toast from 'react-hot-toast'; // import toast
import { AxiosError } from 'axios';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { api } from '../services/api';

// Import icons for the password visibility toggle
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

type UserData = { // Define the UserData type
    name: string;
    email: string;
};

type EditProfileScreenProps = { //
    onLogout: () => void;
    onNavigateToChat: () => void;
};
// Main component for editing user profile
export function EditProfileScreen({ onLogout, onNavigateToChat }: EditProfileScreenProps) {

    const [userData, setUserData] = useState<UserData | null>(null);
    const [activeSection, setActiveSection] = useState<'data' | 'password' | null>(null);

    // Form fields state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Add state to manage password visibility
    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Fetch user data on component mount
    useEffect(() => {
        const loadingToastId = toast.loading("Carregando seus dados...");
        api.get('/me')
            .then(response => {
                toast.dismiss(loadingToastId);
                setUserData(response.data);
            })
            .catch(() => {
                toast.dismiss(loadingToastId);
                toast.error("Não foi possível carregar seus dados.");
            });
    }, []);

    // Toggle between sections
    const toggleSection = (section: 'data' | 'password') => {
        setErrors({});
        setActiveSection(prev => (prev === section ? null : section));
    };

    // Handle updating user data
    const handleUpdateData = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        const payload: { name?: string; email?: string } = {};
        if (name.trim() !== '') payload.name = name.trim();
        if (email.trim() !== '') payload.email = email.trim();

        if (Object.keys(payload).length === 0) {
            toast.error("Você não preencheu nenhum campo para alterar.");
            return;
        }

        if (payload.name && payload.name.length < 3) {
            setErrors({ name: "O nome deve ter pelo menos 3 caracteres." });
            return;
        }

        const loadingToast = toast.loading("Salvando alterações...");
        try { // API call to update user data
            const response = await api.put('/user', payload);
            setUserData(response.data);
            setName('');
            setEmail('');
            toast.success("Dados atualizados com sucesso!", { id: loadingToast });
            setActiveSection(null);
        } catch (error) {
            console.error("Falha ao atualizar dados:", error);
            toast.error("Falha ao atualizar os dados.", { id: loadingToast });
        }
    };
    // Handle changing password
    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        const newErrors: { [key: string]: string } = {};
        if (newPassword.length < 6) {
            newErrors.newPassword = "A nova senha deve ter no mínimo 6 caracteres.";
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "As senhas não coincidem.";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const payload = { currentPassword, newPassword };
        const loadingToast = toast.loading("Alterando senha...");
        try { // API call to change password
            await api.put('/user/password', payload);
            toast.success("Senha alterada com sucesso!", { id: loadingToast });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setActiveSection(null);
        } catch (error) {
            let message = "Falha ao alterar a senha.";
            if (error instanceof AxiosError && error.response) {
                message = error.response.data.message || message;
            } else {
                console.error("Um erro inesperado ocorreu:", error);
            }
            toast.error(message, { id: loadingToast });
        }
    };
    // Render component
    return (
        <div className="flex flex-col min-h-screen bg-light">
            <Header
                variant='private-edit' // Use the private-edit variant
                onLogout={onLogout}
            />
            {/* Main content area */}
            <main className="flex-grow flex flex-col items-center p-4">
                <div className="w-full max-w-2xl mt-12">
                    <h1 className="text-3xl font-bold text-dark text-center mb-8">Editar Perfil</h1>
                    {/* Section toggles */}
                    <div className="bg-secondary rounded-lg mb-4">
                        <button onClick={() => toggleSection('data')} className="w-full p-4 text-left text-light font-bold text-lg flex justify-between items-center">
                            Dados Pessoais
                            <span>{activeSection === 'data' ? '−' : '+'}</span>
                        </button>
                        {activeSection === 'data' && (
                            <form onSubmit={handleUpdateData} className="p-4 border-t border-dark flex flex-col gap-4">
                                <div>
                                    <label htmlFor="name" className=" font-semibold text-light">Nome (atual: {userData?.name})</label>
                                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Digite o novo nome" className="w-full p-2 mt-1 rounded bg-light text-dark" />
                                    {errors.name && <p className="text-dark text-sm mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className=" font-semibold text-light">Email (atual: {userData?.email})</label>
                                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Digite o novo email" className="w-full p-2 mt-1 rounded bg-light text-dark" />
                                </div>
                                <button type="submit" className="bg-dark text-light font-bold py-2 px-4 rounded-lg hover:bg-primary transition-colors self-end">
                                    Salvar
                                </button>
                            </form>
                        )}
                    </div>
                    {/* Password change section */}
                    <div className="bg-dark rounded-lg">
                        <button onClick={() => toggleSection('password')} className="w-full p-4 text-left text-light font-bold text-lg flex justify-between items-center">
                            Senha e Segurança
                            <span>{activeSection === 'password' ? '−' : '+'}</span>
                        </button>
                        {activeSection === 'password' && (
                            <form onSubmit={handleChangePassword} className="p-4 border-t border-secondary flex flex-col gap-4">
                                {/* Current Password Field with visibility toggle */}
                                <div className="relative">
                                    <label htmlFor="currentPassword" className=" font-semibold text-light">Senha Atual</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="currentPassword"
                                        value={currentPassword}
                                        onChange={e => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full p-2 mt-1 rounded bg-light text-dark pr-10"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute bottom-1 right-0 flex items-center pr-3 text-gray-500">
                                        {showPassword ? <EyeSlashIcon className="h-5 w-5 text-lightText" /> : <EyeIcon className="h-5 w-5 text-lightText" />}
                                    </button>
                                </div>
                                {/* New Password Field with visibility toggle */}
                                <div className="relative">
                                    <label htmlFor="newPassword" className="font-semibold text-light">Nova Senha</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="Mínimo de 6 caracteres"
                                        className="w-full p-2 mt-1 rounded bg-light text-dark pr-10"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute bottom-1 right-0 flex items-center pr-3 text-gray-500">
                                        {showPassword ? <EyeSlashIcon className="h-5 w-5 text-lightText" /> : <EyeIcon className="h-5 w-5 text-lightText" />}
                                    </button>
                                </div>
                                {errors.newPassword && <p className="text-secondary text-sm -mt-3">{errors.newPassword}</p>}
                                {/* Confirm New Password Field with visibility toggle */}
                                <div className="relative">
                                    <label htmlFor="confirmPassword" className="font-semibold text-light">Confirmar Nova Senha</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Repita a nova senha"
                                        className="w-full p-2 mt-1 rounded bg-light text-dark pr-10"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute bottom-1 right-0 flex items-center pr-3 text-gray-500">
                                        {showPassword ? <EyeSlashIcon className="h-5 w-5 text-lightText" /> : <EyeIcon className="h-5 w-5 text-lightText" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-secondary text-sm -mt-3">{errors.confirmPassword}</p>}
                                <button type="submit" className="bg-secondary text-light font-bold py-2 px-4 rounded-lg hover:bg-primary transition-colors self-end ">
                                    Alterar Senha
                                </button>
                            </form>
                        )}
                    </div>
                    <button onClick={onNavigateToChat} className=" text-1xl font-bold mt-8 text-secondary hover:underline hover:text-primary mx-auto block">Voltar para o Chat</button>
                </div>
            </main>

            <Footer />
        </div>
    );
}