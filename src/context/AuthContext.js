import { createContext, useContext, useState } from 'react';

// 1. Création du contexte

// GSB Frais - React

// Partie 1 - Login

const AuthContext = createContext();

// 2. Fournisseur du contexte (AuthProvider)
export function AuthProvider({ children }) {
  // État local pour stocker l'utilisateur (null = non connecté)
  // TODO : affecter la valeur nulle
  const [user, setUser] = useState(null);

  // // Fonction de connexion
  const loginUser = (login, password) => {
    // TODO : Implémenter une connexion avec une logique simplifiée :
    // vérifie
    if (login === "Andre" && password === "secret") {
      setUser(login);
      return true;
    } else {
      return false;
    }
    // Si le login vaut "Andre" et le mot de passe vaut "secret"
    // alors renvoyer true et mettre à jour l'état avec le login de
    // l'utilisateur connecté
    // Si la connexion échoue, renvoyer false
  };

  // // Fonction de déconnexion
  const logoutUser = () => {
    // TODO : réinitialiser la valeur de l'état à null
    setUser(null);
  };

  // // Valeurs exposées aux composants enfants
  return (
    <AuthContext.Provider value={ { user, loginUser, logoutUser } }>
      {children} {/* Rend les composants enfants (ex. App) */}
    </AuthContext.Provider>
  );
}

// 4. Hook personnalisé pour utiliser le contexte facilement
export function useAuth() {
  return useContext(AuthContext);
}