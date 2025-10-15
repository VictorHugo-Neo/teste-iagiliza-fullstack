// Definimos as propriedades que a tela irá receber do App.tsx
type EditProfileScreenProps = {
  onLogout: () => void;
  onNavigateToChat: () => void;
};

export function EditProfileScreen({ onLogout, onNavigateToChat }: EditProfileScreenProps) {
  return (
    <div>
      <h1>Página de Edição de Perfil</h1>
      <p>Em breve...</p>
      <button onClick={onNavigateToChat}>Voltar para o Chat</button>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}