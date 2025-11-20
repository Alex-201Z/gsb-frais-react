// TODO (question 2) : importer les dépendances nécessaires
import React, { useState, useEffect } from 'react';
import fraisData from '../data/frais.json';
import '../styles/FraisTable.css';
import { tab } from '@testing-library/user-event/dist/tab';
// TODO (question 3): déclarer un composant fonctionnel FraisTable
 function FraisTable() { 
  // TODO (question 4): Déclarer l'état 'frais' avec useState
  const [ fraisList, setFraisList ] = useState([]);
  const [loading , setLoading] = useState(true);
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ filterNonNull, setFilterNonNull ] = useState(true);
  useEffect(() => {
  // Simulation d'un appel API avec un délai de 500 ms
  setTimeout(() => {
    setFraisList(fraisData); // Met à jour l'état avec les données du fichier JSON
    setLoading(false); // Met fin à l'état de chargement
  }, 600); // Délai pour simuler un chargement
}, []); // Tableau de dépendances vide = exécute une seule fois

if (loading) return <div><b>Chargement des frais...</b></div>;

// Logique de filtrage : filtre les frais en fonction du terme de recherche
const filteredFrais = fraisList
  .filter((frais) => frais.montantvalide !== null) // Exclut les frais avec montantvalide = null
  .filter((frais) =>
    frais.anneemois.includes(searchTerm) ||
    frais.id_visiteur.toString().includes(searchTerm)
  .filter((f) => !filterNonNull || f.montantvalide !== null)
  );
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
          </tr>
        </thead>
        <tbody>
          {fraisData.map((frais) => (
            <tr key={frais.id}>
              <td>{frais.id_frais}</td>
              <td>{frais.id_etat}</td>
              <td>{frais.anneemois}</td>
              <td>{frais.id_visiteur}</td>
              <td>{frais.nbjustificatifs}</td>
              <td>{frais.datemodification}</td>
              <td>{frais.montantSaisi}</td>
              <td>{frais.montantvalide}</td>
            </tr>
          ))}

            {/* TODO (question 6): Utiliser la méthode map pour afficher chaque frais */}
            {/* TODO (question 7): Ajouter l'id du frais comme valeur pour key */}
           
        </tbody>
      </table>
    </div>
  );
};

export default FraisTable;
