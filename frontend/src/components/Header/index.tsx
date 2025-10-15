type HeaderProps = {
  variant: 'public-login' | 'public-register' | 'private-chat' | 'private-edit'; // Variant to determine which buttons to show
  onNavigateToLogin?: () => void;
  onLogout?: () => void;
  onNavigateToRegister?: () => void;
  onNavigateToEditProfile?: () => void;
};
// Header component with centered title and right-aligned buttons
export const Header = ({
  variant,
  onNavigateToLogin,
  onLogout,
  onNavigateToRegister,
  onNavigateToEditProfile,
}: HeaderProps) => {
  return (
    <header className="bg-dark p-4 flex items-center justify-between shadow-md relative">
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="text-primary text-3xl font-bold">Liza</span>
      </div>
      <div className="flex w-full justify-end items-center gap-4">
       
        {/* Conditional rendering of buttons based on the variant */}
        {variant === 'public-login' && (
          <button onClick={onNavigateToRegister} className="bg-primary  hover:bg-blue-600 text-light font-semibold py-2 px-4 rounded-md">
            CADASTRE-SE
          </button>
        )}

        {/* Button to navigate to login screen from registration screen */}
        {variant === 'public-register' && (
          <button onClick={onNavigateToLogin} className="bg-primary hover:bg-blue-600 text-light font-semibold py-2 px-4 rounded-md">
            LOGIN
          </button>
        )}
        {/* Buttons for private chat screen */}
        {variant === 'private-chat' && (
          <>
            <button onClick={onNavigateToEditProfile} className="bg-primary hover:bg-blue-600 text-light font-semibold py-2 px-4 rounded-md">
              Editar Dados
            </button>
            <button onClick={onLogout} className="bg-danger hover:bg-red-700 text-light font-semibold py-2 px-4 rounded-md">
              Logout
            </button>
          </>
        )}
        {/* Button for private edit profile screen */}
        {variant === 'private-edit' && (
          <button onClick={onLogout} className="bg-danger hover:bg-red-700 text-light font-semibold py-2 px-4 rounded-md">
            Logout
          </button>
        )}
      </div>
    </header>
  );
};