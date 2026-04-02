import { useAuth } from '../context/AuthContext';
import MedicamentForm from '../components/MedicamentForm';

function MedicamentAdd() {
  const { user } = useAuth();

  return <div>{user != null && <MedicamentForm />}</div>;
}

export default MedicamentAdd;
