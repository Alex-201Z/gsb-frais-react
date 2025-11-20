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
        <center><h1>Connexion</h1></center>
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label>Login : </label>
            <br></br>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div><br></br>
            <div>
            <label>Mot de passe : </label>
            <br></br>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <br></br>
          <button type="submit" className='nav-link'>Se connecter</button>
        </form>
        <br></br>
        <Link to="dashboard" className='nav-link'>Accueil</Link>
      </div>
    </div>
  );
}