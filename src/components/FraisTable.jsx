import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../services/authService';
import '../styles/FraisTable.css';

function FraisTable() {
  const [fraisList, setFraisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNonNull, setFilterNonNull] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    let active = true;

    const fetchFrais = async () => {
      try {
        const response = await axios.get(`${API_URL}frais/liste/${user.id_visiteur}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!active) {
          return;
        }

        setFraisList(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Erreur lors de la récupération des frais:', error);
        if (active) {
          setFraisList([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchFrais();

    return () => {
      active = false;
    };
  }, [token, user]);

  const filteredFrais = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return fraisList.filter((frais) => {
      if (filterNonNull && (frais.montantvalide == null || frais.montantvalide === '')) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        frais.anneemois?.toString().toLowerCase().includes(normalizedSearch) ||
        frais.id_visiteur?.toString().toLowerCase().includes(normalizedSearch) ||
        frais.montantvalide?.toString().toLowerCase().includes(normalizedSearch) ||
        frais.lib_etat?.toString().toLowerCase().includes(normalizedSearch)
      );
    });
  }, [filterNonNull, fraisList, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce frais ?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}frais/suppr`, {
        data: { id_frais: id },
        headers: { Authorization: `Bearer ${token}` },
      });

      setFraisList((prev) => prev.filter((frais) => frais.id_frais !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  if (loading) {
    return <div className="frais-table-container medicament-loading-state">Chargement des frais...</div>;
  }

  return (
    <div className="frais-table-container">
      <section className="medicament-section-card">
        <h2>Liste des Frais</h2>

        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par année-mois, visiteur, état ou montant..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <div className="medicament-toolbar">
            <div className="filter-container">
              <label>
                <input
                  type="checkbox"
                  checked={filterNonNull}
                  onChange={(event) => setFilterNonNull(event.target.checked)}
                />
                Afficher seulement les frais avec un montant validé
              </label>
            </div>
          </div>
        </div>

        <div className="medicament-table-wrapper">
          <table className="frais-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>État</th>
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
              {filteredFrais.length === 0 && (
                <tr>
                  <td colSpan="9">Aucun frais ne correspond au filtre courant.</td>
                </tr>
              )}
              {filteredFrais.map((frais) => (
                <tr key={frais.id_frais}>
                  <td>{frais.id_frais}</td>
                  <td>{frais.lib_etat || frais.id_etat}</td>
                  <td>{frais.anneemois}</td>
                  <td>{frais.id_visiteur}</td>
                  <td>{frais.nbjustificatifs}</td>
                  <td>{frais.datemodification}</td>
                  <td>{frais.montantSaisi ?? '-'}</td>
                  <td>{frais.montantvalide}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/frais/modifier/${frais.id_frais}`)}
                      className="edit-button"
                    >
                      Modifier
                    </button>
                    <button onClick={() => handleDelete(frais.id_frais)} className="delete-button">
                      Suppression
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default FraisTable;
