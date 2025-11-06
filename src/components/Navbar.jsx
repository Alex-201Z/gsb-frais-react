import styles from '../styles/Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="style">
      <div className="navbardiv">
        <div >
          <Link to="/home" className='nav-link'>Accueil</Link>
          <Link to="/dashboard" className='nav-link'>Tableau de bord</Link>
        </div>
        <div>
          <Link to=""className='nav-link'>Déconnexion</Link>
          <Link to="/login"className='nav-link'>Connexion</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;