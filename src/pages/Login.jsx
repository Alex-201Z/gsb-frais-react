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

// 4. Déclaration de la fonction handleSubmit
const handleSubmit = (e) => {
  e.preventDefault(); // Empêche le rechargement de la page
  // Appel de la fonction login avec email et password
  if (loginUser(login, password)) {
    navigate('/dashboard'); // Redirige vers /dashboard si succès
  } else {
    alert('Identifiants incorrects'); // Affiche une erreur si échec
  }
};

  // 5. Rend le formulaire
  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Connexion</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label>Login : </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          // TODO : compléter le formulaire de connexion
            <div>
            <label>Mot de passe : </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Se connecter</button>
        </form>
        <Link to="dashboard" className='nav-link'>Accueil</Link>
      </div>
    </div>
  );
}