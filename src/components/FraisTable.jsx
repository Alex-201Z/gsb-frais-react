// TODO (question 2) : importer les dépendances nécessaires
import React, { useState, useEffect } from 'react';
import fraisData from '../data/frais.json';
import '../styles/FraisTable.css';
import { tab } from '@testing-library/user-event/dist/tab';
// TODO (question 3): déclarer un composant fonctionnel FraisTable
 function FraisTable() { 
  // TODO (question 4): Déclarer l'état 'frais' avec useState
  const [ etat ] = useState([]);
  const [etatloaded , setEtatLoaded] = useState(true);
  return (
    <div className="frais-table-container">
      <h2>Liste des Frais</h2>
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
