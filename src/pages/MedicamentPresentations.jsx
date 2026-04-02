import { useAuth } from '../context/AuthContext';
import TopPresentationsTable from '../components/TopPresentationsTable';

function MedicamentPresentations() {
  const { user } = useAuth();

  if (!user) {
    return <div>Vous devez être connecté pour voir les présentations prescrites.</div>;
  }

  return <TopPresentationsTable />;
}

export default MedicamentPresentations;
