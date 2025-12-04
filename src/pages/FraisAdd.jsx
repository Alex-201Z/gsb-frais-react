import { useAuth } from "../context/AuthContext";
import FraisForm from "../components/FraisForm";


function FraisAdd() {
  const { token, user } = useAuth();
  return (
    <div>
      {user != null && (  <FraisForm /> )}
    </div>
  );
}

export default FraisAdd;