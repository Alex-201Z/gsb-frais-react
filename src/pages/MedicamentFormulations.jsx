import { useAuth } from '../context/AuthContext';
import MedicamentFormulationManager from '../components/MedicamentFormulationManager';

function MedicamentFormulations() {
  const { user } = useAuth();

  if (!user) {
    return <div>Vous devez être connecté pour gérer les formulations.</div>;
  }

  return <MedicamentFormulationManager />;
}

export default MedicamentFormulations;
