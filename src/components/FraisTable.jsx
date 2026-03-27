// TODO (question 2) : importer les dépendances nécessaires
import React, { useState, useEffect } from 'react';
import '../styles/FraisTable.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../services/authService';
import { useNavigate } from 'react-router-dom';

// TODO (question 3): déclarer un composant fonctionnel FraisTable
function FraisTable() {
  // TODO (question 4): Déclarer l'état 'frais' avec useState
  const [fraisList, setFraisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNonNull, setFilterNonNull] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();




  useEffect(() => {
    const fetchFrais = async () => {
      try {
        const response = await
          axios.get(`${API_URL}frais/liste/${user.id_visiteur}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });        // TODO : Met à jour l'état avec les données de l'API 
        setFraisList(response.data);
        setLoading(false);
        // TODO : Met fin à l'état de chargement

      } catch (error) {
        console.error('Erreur lors de la récupération des frais:', error);
        // TODO : Arrête le chargement même en cas d'erreur 
        setLoading(false);
      }
    };
    fetchFrais(); // Appelle la fonction pour récupérer les données 

  }, []); // Tableau de dépendances vide = exécute une seule fois 

  // Logique de filtrage : filtre les frais en fonction du terme de recherche
  {/* const filteredFrais = fraisList
    .filter(( frais) => frais.montantvalide !== null) // Exclut les frais avec montantvalide = null
    .filter((frais) =>
      frais.anneemois.includes(searchTerm) ||
      frais.id_visiteur.toString().includes(searchTerm)
        .filter((f) => !filterNonNull || f.montantvalide !== null)
    );
    */}
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce frais ?')) return;
    try {
      await axios.delete(
        `${API_URL}frais/suppr`,
        {
          data: { id_frais: id },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Met à jour FraisList en ignorant le frais qui a été supprimé : on ne garde que les frais dont l’id est différent de l’id du frais sélectionné
      setFraisList(fraisList.filter((frais) => frais.id_frais !== id));
    } catch (error) { console.error('Erreur lors de la suppression:', error); }


  }
  return (

    <div className="frais-table-container">
      <h2>Liste des Frais</h2>

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
            Afficher seulement les frais avec un montant validé
          </label>
        </div>
      </div>
      {/* TODO (question 5): Compléter les en-têtes du tableau */}
      <table className="frais-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID État</th>
            <th>Année-Mois</th>
            <th>ID Visiteur</th>
            <th>Nombre de justificatifs</th>
            <th>Date de modification</th>
            <th>Montant saisi</th>
            <th>Montant validé</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {fraisList.map((frais) => (
            <tr key={frais.id}>
              <td>{frais.id_frais}</td>
              <td>{frais.id_etat}</td>
              <td>{frais.anneemois}</td>
              <td>{frais.id_visiteur}</td>
              <td>{frais.nbjustificatifs}</td>
              <td>{frais.datemodification}</td>
              <td>{frais.montantSaisi}</td>
              <td>{frais.montantvalide}</td>
              <td>
                <button onClick={() => navigate(`/frais/modifier/${frais.id_frais}`)}
                  className="edit-button"
                >
                  Modifier
                </button>
                <button onClick={() => handleDelete(frais.id_frais)}
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

export default FraisTable;
