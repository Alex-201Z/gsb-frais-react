import { createContext, useEffect, useContext, useState } from 'react';
import { signIn, logout, getAuthToken, getCurrentUser } from '../services/authService'; 


// 1. Création du contexte

// GSB Frais - React

// Partie 1 - Login
const AuthContext = createContext();





// 2. Fournisseur du contexte (AuthProvider)
export function AuthProvider({ children }) {
  // État local pour stocker l'utilisateur (null = non connecté)
  // TODO : affecter la valeur nulle
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // // Fonction de connexion
useEffect(() => { 
const user = getCurrentUser(); 
const token = getAuthToken(); 
if (user && token) { 
setUser(user); 
setToken(token); 
} 
}, []); 

  const loginUser = async (login, password) => { 
const data = await signIn(login, password); 
setUser(data.visiteur); 
setToken(data.access_token); 
setLoading(false);
return data; 
};

  // // Fonction de déconnexion
  const logoutUser = () => { 
logout(); 
setUser(null); 
setToken(null); 
}; 

  // // Valeurs exposées aux composants enfants
  return ( 
<AuthContext.Provider value={{ user, token, loading, loginUser, logoutUser }}>  
{children} 
</AuthContext.Provider> 
);
}

// 4. Hook personnalisé pour utiliser le contexte facilement
export function useAuth() {
  return useContext(AuthContext);
}