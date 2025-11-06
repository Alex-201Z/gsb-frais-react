import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';


function App() {
  return (
<BrowserRouter>
  {/* Liens temporaires pour tester les routes */}
 <Navbar />
  {/* Routes de l'application */}
  <AuthProvider>
  <Routes>
    <Route path="/home" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
  </AuthProvider>
</BrowserRouter>
);
}

export default App;
