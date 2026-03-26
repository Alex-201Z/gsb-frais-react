import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import FraisAdd from './pages/FraisAdd';
import FraisEdit from './pages/FraisEdit';
import DashboardMedicaments from './pages/DashboardMedicament';


function App() {
  return (
    <BrowserRouter>
      {/* Liens temporaires pour tester les routes */}

      {/* Routes de l'application */}
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/frais/ajouter" element={<FraisAdd />} />
          <Route path="/frais/modifier/:id" element={<FraisEdit />} />
          <Route path="/dashboardmedicaments" element={<DashboardMedicaments />} />
      {/*  <Route path="/frais/:id/hors-forfait" element={<FraisHorsForfait />} />
          <Route path="/frais/:id/hors-forfait/ajouter" element={<FraisHorsForfaitAdd />} />
          <Route path="/frais/:id/hors-forfait/modifier/:idHF" element={<FraisHorsForfaitEdit />} /> */}

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
