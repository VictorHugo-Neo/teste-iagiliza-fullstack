import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export function RegisterScreen() {
    return (
        <div className="flex flex-col min-h-screen bg-light text-white">
            {/* Header component */}
            <Header />
            {/* Main content area */}
            <main className="flex-grow flex items-center justify-center p-4">
                {/* Registration form container */}
                <div className="bg-[#FF6600] w-full max-w-md p-8 rounded-lg shadow-xl">
                    <h2 className="text-white text-3xl font-bold text-center mb-6">
                        CADASTRO
                    </h2>
                    <form className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Digite seu nome"
                            className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <input
                            type="email"
                            placeholder="Digite seu email"
                            className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <input
                            type="password"
                            placeholder="Confirme sua senha"
                            className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <button
                            type="submit"
                            className="w-full bg-gray-200 text-[#FF6600] font-bold p-3 rounded-md mt-4 hover:bg-gray-300 transition-colors"
                        >
                            CRIAR CONTA
                        </button>
                    </form>
                </div>
            </main>
            {/* Footer component */}
            <Footer />
        </div>
    );
}
