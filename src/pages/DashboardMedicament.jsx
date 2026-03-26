import { useAuth } from "../context/AuthContext"; 
import MedicamentTable from "../components/MedicamentTable";

function DashboardMedicaments() {
  const { user } = useAuth();
  return (
    <div>
      {user == null && <h1> Bonjour</h1>}
      {user != null && <h1> Bonjour {user.nom_visiteur} </h1>}
      {user != null && <MedicamentTable/>}
    </div>
  
    
  );
}
export default DashboardMedicaments;