import { Footer } from "../components/Footer";
// Landing page component with header, main content, and footer
type LandingPageProps = {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
};

// LandingPage component definition
export function LandingPage({ onNavigateToLogin, onNavigateToRegister }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      
      <header className="bg-dark p-4 text-center">
        <span className="text-primary text-3xl font-bold">Liza</span>
      </header>

      <main className="flex-grow flex items-center justify-center bg-light p-4">
        <div className="bg-secondary text-light p-12 md:p-20 rounded-lg shadow-xl text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            E se a sua curiosidade tivesse um assistente pessoal?
          </h1>

          {/* Description paragraph */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={onNavigateToRegister}
              className="bg-light text-secondary font-bold py-3 px-6 rounded-lg shadow-md hover:bg-primary hover:text-light transition-colors"
            >
              Crie sua conta e aproveite
            </button>
            <button
              onClick={onNavigateToLogin}
              className="bg-dark text-light font-bold py-3 px-6 rounded-lg shadow-md hover:bg-primary transition-colors"
            >
              Já tenho uma conta
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}