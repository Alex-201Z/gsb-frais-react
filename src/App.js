import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import FraisAdd from './pages/FraisAdd';
import FraisEdit from './pages/FraisEdit';
import DashboardMedicaments from './pages/DashboardMedicament';
import MedicamentAdd from './pages/MedicamentAdd';
import MedicamentEdit from './pages/MedicamentEdit';
import MedicamentFormulations from './pages/MedicamentFormulations';
import MedicamentComposants from './pages/MedicamentComposants';
import MedicamentPresentations from './pages/MedicamentPresentations';


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
          <Route path="/medicament/ajouter" element={<MedicamentAdd />} />
          <Route path="/medicament/modifier/:id" element={<MedicamentEdit />} />
          <Route path="/medicament/formulations" element={<MedicamentFormulations />} />
          <Route path="/medicament/composants" element={<MedicamentComposants />} />
          <Route path="/medicament/presentations" element={<MedicamentPresentations />} />
      {/*  <Route path="/frais/:id/hors-forfait" element={<FraisHorsForfait />} />
          <Route path="/frais/:id/hors-forfait/ajouter" element={<FraisHorsForfaitAdd />} />
          <Route path="/frais/:id/hors-forfait/modifier/:idHF" element={<FraisHorsForfaitEdit />} /> */}

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
