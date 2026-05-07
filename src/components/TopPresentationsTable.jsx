import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMedicamentData } from '../services/medicamentService';
import '../styles/FraisTable.css';

function TopPresentationsTable() {
  const [topPresentations, setTopPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    let active = true;

    const loadData = async () => {
      try {
        const { data } = await fetchMedicamentData(token, ['topPresentations']);

        if (!active) {
          return;
        }

        setTopPresentations(data.topPresentations || []);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [token, user]);

  if (loading) {
    return <div className="medicament-table-container medicament-loading-state">Chargement des présentations...</div>;
  }

  return (
    <div className="medicament-table-container">
      <div className="medicament-page-actions">
        <button className="secondary-button" onClick={() => navigate('/dashboardmedicaments')}>
          Retour aux médicaments
        </button>
      </div>

      <section className="medicament-section-card">
        <h3>Affichage des dix présentations les plus prescrites</h3>

        <div className="medicament-table-wrapper">
          <table className="medicament-table medicament-subtable">
            <thead>
              <tr>
                <th>Rang</th>
                <th>Présentation</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {topPresentations.length === 0 && (
                <tr>
                  <td colSpan="3">Aucune donnée disponible pour calculer le classement.</td>
                </tr>
              )}
              {topPresentations.map((presentation, index) => (
                <tr key={presentation.id_presentation}>
                  <td>{index + 1}</td>
                  <td>{presentation.lib_presentation}</td>
                  <td>{presentation.nb_prescriptions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default TopPresentationsTable;
