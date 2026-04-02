import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function Navbar() {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="style">
      <div className="navbardiv">
        <div className="nav-links">
          {user && <Link to="/home" className="nav-link">Accueil</Link>}
          {user && <Link to="/dashboard" className="nav-link">Tableau de bord des Frais</Link>}
          {user && <Link to="/dashboardmedicaments" className="nav-link">Tableau de bord des Médicaments</Link>}
          {user && <Link to="/medicament/formulations" className="nav-link nav-link-soft">Formulations</Link>}
          {user && <Link to="/medicament/composants" className="nav-link nav-link-soft">Composants</Link>}
          {user && <Link to="/medicament/presentations" className="nav-link nav-link-soft">Présentations prescrites</Link>}
          {user && <Link to="/frais/ajouter" className="nav-link nav-link-soft">Ajouter Frais</Link>}
        </div>
        <div className="nav-actions">
          {user && <button onClick={logoutUser} className="nav-button nav-button-ghost">Déconnexion</button>}
          {!user && <Link to="/login" className="nav-button">Connexion</Link>}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
