import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../services/authService';
import { fetchMedicamentData, normalizeId, pickFirstValue } from '../services/medicamentService';
import '../styles/FraisTable.css';

function MedicamentTable() {
  const [medicamentList, setMedicamentList] = useState([]);
  const [familleList, setFamilleList] = useState([]);
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

    const loadData = async () => {
      try {
        const { data } = await fetchMedicamentData(token, ['medicaments', 'familles']);
        if (!active) {
          return;
        }

        setMedicamentList(data.medicaments || []);
        setFamilleList(data.familles || []);
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

  const familleMap = useMemo(() => {
    const map = new Map();
    familleList.forEach((famille) => {
      const familleId = pickFirstValue(famille, ['id_famille', 'id']);
      if (familleId !== '') {
        map.set(normalizeId(familleId), pickFirstValue(famille, ['lib_famille', 'nom_famille'], familleId));
      }
    });
    return map;
  }, [familleList]);

  const medicamentRows = useMemo(
    () =>
      medicamentList.map((medicament) => {
        const familleId = pickFirstValue(medicament, ['id_famille', 'famille_id']);
        return {
          ...medicament,
          familleLabel:
            pickFirstValue(medicament, ['lib_famille', 'nom_famille']) ||
            familleMap.get(normalizeId(familleId)) ||
            familleId ||
            'Non renseignée',
        };
      }),
    [medicamentList, familleMap]
  );

  const filteredMedicaments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return medicamentRows.filter((medicament) => {
      if (filterNonNull && (medicament.prix_echantillon == null || medicament.prix_echantillon === '')) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        medicament.nom_commercial?.toString().toLowerCase().includes(normalizedSearch) ||
        medicament.familleLabel?.toString().toLowerCase().includes(normalizedSearch)
      );
    });
  }, [filterNonNull, medicamentRows, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}medicament/suppr`, {
        data: { id_medicament: id },
        headers: { Authorization: `Bearer ${token}` },
      });

      setMedicamentList((prev) =>
        prev.filter(
          (medicament) => normalizeId(pickFirstValue(medicament, ['id_medicament', 'id'])) !== normalizeId(id)
        )
      );
    } catch (error) {
      console.error('Erreur lors de la suppression du médicament :', error);
    }
  };

  if (loading) {
    return <div className="medicament-table-container medicament-loading-state">Chargement des données médicaments...</div>;
  }

  return (
    <div className="medicament-table-container">
      <div className="medicament-page-actions">
        <button className="add-button" onClick={() => navigate('/medicament/ajouter')}>
          Ajouter un médicament
        </button>
      </div>

      <section className="medicament-section-card">
        <h3>Recherche d&apos;un médicament sur le nom ou sur la famille</h3>
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par nom commercial ou famille..."
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
                Afficher seulement les médicaments avec un prix échantillon non vide
              </label>
            </div>
          </div>
        </div>

        <div className="medicament-table-wrapper">
          <table className="medicament-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Famille</th>
                <th>Dépôt légal</th>
                <th>Nom commercial</th>
                <th>Effets</th>
                <th>Contre-indication</th>
                <th>Prix échantillon</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicaments.length === 0 && (
                <tr>
                  <td colSpan="8">Aucun médicament ne correspond au filtre courant.</td>
                </tr>
              )}
              {filteredMedicaments.map((medicament) => {
                const medicamentId = pickFirstValue(medicament, ['id_medicament', 'id']);

                return (
                  <tr key={medicamentId || medicament.nom_commercial}>
                    <td>{medicamentId}</td>
                    <td>{medicament.familleLabel}</td>
                    <td>{medicament.depot_legal}</td>
                    <td>{medicament.nom_commercial}</td>
                    <td>{medicament.effets}</td>
                    <td>{medicament.contre_indication}</td>
                    <td>{medicament.prix_echantillon}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => navigate(`/medicament/modifier/${medicamentId}`)}
                      >
                        Modifier
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(medicamentId)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default MedicamentTable;
