import styles from '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="style">
      <div className="navbardiv">
        <div >
          <button className='nav-link'><Link to="/home" className='nav-link'>Accueil</Link></button>
          {user && <button className='nav-link'><Link to="/dashboard" className='nav-link'>Tableau de bord</Link></button>}
        </div>
        <div>
          {user && <button onClick={ logoutUser} className='nav-link'>Déconnexion</button> }
          <button className='nav-link'><Link to="/login"className='nav-link'>Connexion</Link></button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;