// TODO (question 2) : importer les dépendances nécessaires
import React, { useState, useEffect } from 'react';
import '../styles/FraisTable.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../services/authService';
import { useNavigate } from 'react-router-dom';

// TODO (question 3): déclarer un composant fonctionnel medicamentTable
function MedicamentTable() {
  // TODO (question 4): Déclarer l'état 'medicament' avec useState
  const [medicamentList, setmedicamentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNonNull, setFilterNonNull] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();




  useEffect(() => {
    const fetchmedicament = async () => {
      try {
        const response = await
          axios.get(`${API_URL}medicament/listemedicament_API`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });// Requête get à l'API à l'url         // TODO : Met à jour l'état avec les données de l'API 
        setmedicamentList(response.data);
        setLoading(false);
        // TODO : Met fin à l'état de chargement

      } catch (error) {
        console.error('Erreur lors de la récupération des medicament:', error);
        // TODO : Arrête le chargement même en cas d'erreur 
        setLoading(false);
      }
    };
    fetchmedicament(); // Appelle la fonction pour récupérer les données 

  }, []); // Tableau de dépendances vide = exécute une seule fois 

  // Logique de filtrage : filtre les medicament en fonction du terme de recherche
  {/* const filteredmedicament = medicamentList
    .filter((medicament) => medicament.montantvalide !== null) // Exclut les medicament avec montantvalide = null
    .filter((medicament) =>
      medicament.anneemois.includes(searchTerm) ||
      medicament.id_visiteur.toString().includes(searchTerm)
        .filter((f) => !filterNonNull || f.montantvalide !== null)
    ); */}
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce medicament ?')) return;
    try {
      await axios.delete(
        `${API_URL}medicament/suppr`,
        {
          data: { id_medicament: id },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Met à jour medicamentList en ignorant le medicament qui a été supprimé : on ne garde que les medicament dont l’id est différent de l’id du medicament sélectionné
      setmedicamentList(medicamentList.filter((medicament) => medicament.id_medicament !== id));
    } catch (error) { console.error('Erreur lors de la suppression:', error); }


  }
  return (

    <div className="medicament-table-container">
      <h2>Liste des medicament</h2>

      {/* Champ de recherche pour le filtrage */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher par année-mois, ID visiteur ou montant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Met à jour searchTerm
        />
        {/* Case à cocher */}
        <div className="filter-container">
          <label>
            <input
              type="checkbox"
              checked={filterNonNull}
              onChange={(e) => setFilterNonNull(e.target.checked)}
            />
            Afficher seulement les medicament avec un montant validé
          </label>
        </div>
      </div>
      {/* TODO (question 5): Compléter les en-têtes du tableau */}
      <table className="medicament-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>famille</th>
            <th>Année-Mois</th>
            <th>Depot Legal</th>
            <th>Nom commerciaux</th>
            <th>Effets</th>
            <th>Contre indication</th>
            <th>Prix echantillon</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {medicamentList.map((medicament) => (
            <tr key={medicament.id}>
              <td>{medicament.id_medicament}</td>
              <td>{medicament.id_famille}</td>
              <td>{medicament.depot_legal}</td>
              <td>{medicament.nom_commercial}</td>
              <td>{medicament.effets}</td>
              <td>{medicament.contre_indication}</td>
              <td>{medicament.prix_echantillon}</td>
              <td>
                <button onClick={() => navigate(`/medicament/modifier/${medicament.id_medicament}`)}
                  className="edit-button"
                >
                  Modifier
                </button>
                <button onClick={() => handleDelete(medicament.id_medicament)}
                  className="delete-button"
                >
                  Supression
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicamentTable;
