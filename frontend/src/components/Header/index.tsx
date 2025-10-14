type HeaderProps = {
  onLogout: () => void;
};
// Header component with centered title and right-aligned buttons
export const Header = ({ onLogout }: HeaderProps) => {
  return (
    <header className="bg-dark p-4 flex items-center justify-between shadow-md relative">
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="text-primary text-3xl font-bold">Liza</span>
      </div>
      <div className="flex w-full justify-end items-center gap-4">
        {/* Placeholder for Edit Data button */}
        <button className="bg-primary hover:bg-blue-600 text-light font-semibold py-2 px-4 rounded-md transition-colors"> 
          Editar Dados
        </button>
        {/* Logout button */}
        <button
          onClick={onLogout}
          className="bg-danger hover:bg-red-700 text-light font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};