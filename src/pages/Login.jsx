import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';



export default function Login() {
  // 1. États locaux pour les champs du formulaire
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  // 3. Hook pour la redirection après connexion

const navigate = useNavigate();
const { loginUser } = useAuth();

// 4. Déclaration de la fonction handleSubmit
const handleSubmit = async (e) => { 
  e.preventDefault(); // Empêche le rechargement de la page
  // Appel de la fonction login avec email et password
  try {
    await loginUser(login, password);
    navigate('/dashboard'); // Redirige vers /dashboard si succès
  } catch {
    alert('Echec de la connexion'); // Affiche une erreur si échec
  }
};

  // 5. Rend le formulaire
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Connexion</h1>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login">Login :</label>
            <input
              id="login"
              className="login-input"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Mot de passe :</label>
            <input
              id="password"
              className="login-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="login-actions">
            <button type="submit" className="login-submit">Se connecter</button>
            <Link to="/home" className="login-back-link">Accueil</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
