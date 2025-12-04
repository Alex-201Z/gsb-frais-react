import { use } from "react";
import Login from "./Login";
import { useAuth } from "../context/AuthContext";
import FraisTable from "../components/FraisTable";  

function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      {user == null && <h1> Bonjour</h1>}
      {user != null && <h1> Bonjour {user.nom_visiteur} </h1>}
      {user != null && <FraisTable />}
    </div>
  
    
  );
}
export default Dashboard;