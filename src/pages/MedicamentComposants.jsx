import { useAuth } from '../context/AuthContext';
import PresentationComponentsTable from '../components/PresentationComponentsTable';

function MedicamentComposants() {
  const { user } = useAuth();

  if (!user) {
    return <div>Vous devez être connecté pour voir les composants.</div>;
  }

  return <PresentationComponentsTable />;
}

export default MedicamentComposants;
