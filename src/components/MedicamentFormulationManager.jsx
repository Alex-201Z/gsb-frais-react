import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../services/authService';
import {
  fetchMedicamentData,
  normalizeId,
  pickFirstValue,
  toNumber,
} from '../services/medicamentService';
import '../styles/FraisTable.css';

function MedicamentFormulationManager() {
  const [medicamentList, setMedicamentList] = useState([]);
  const [familleList, setFamilleList] = useState([]);
  const [presentationList, setPresentationList] = useState([]);
  const [formulerList, setFormulerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formulationForm, setFormulationForm] = useState({
    id_formuler: null,
    id_medicament: '',
    id_presentation: '',
    qte_formuler: '1',
  });
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
        const { data } = await fetchMedicamentData(token, [
          'medicaments',
          'familles',
          'presentations',
          'formuler',
        ]);

        if (!active) {
          return;
        }

        setMedicamentList(data.medicaments || []);
        setFamilleList(data.familles || []);
        setPresentationList(data.presentations || []);
        setFormulerList(data.formuler || []);
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
    [familleMap, medicamentList]
  );

  const medicamentMap = useMemo(() => {
    const map = new Map();
    medicamentRows.forEach((medicament) => {
      const medicamentId = pickFirstValue(medicament, ['id_medicament', 'id']);
      if (medicamentId !== '') {
        map.set(normalizeId(medicamentId), medicament);
      }
    });
    return map;
  }, [medicamentRows]);

  const presentationMap = useMemo(() => {
    const map = new Map();
    presentationList.forEach((presentation) => {
      const presentationId = pickFirstValue(presentation, ['id_presentation', 'id']);
      if (presentationId !== '') {
        map.set(normalizeId(presentationId), presentation);
      }
    });
    return map;
  }, [presentationList]);

  const formulationRows = useMemo(
    () =>
      formulerList.map((formulation) => {
        const medicamentId = pickFirstValue(formulation, ['id_medicament', 'medicament_id']);
        const presentationId = pickFirstValue(formulation, ['id_presentation', 'presentation_id']);
        const medicament = medicamentMap.get(normalizeId(medicamentId));
        const presentation = presentationMap.get(normalizeId(presentationId));

        return {
          ...formulation,
          medicamentId,
          presentationId,
          medicamentLabel:
            medicament?.nom_commercial || medicament?.nom_medicament || `Médicament ${medicamentId}`,
          presentationLabel:
            pickFirstValue(presentation, ['lib_presentation', 'nom_presentation'], '') ||
            `Présentation ${presentationId}`,
          quantite: pickFirstValue(formulation, ['qte_formuler', 'quantite'], ''),
        };
      }),
    [formulerList, medicamentMap, presentationMap]
  );

  const handleFormulationEdit = (formulation) => {
    setFormulationForm({
      id_formuler: pickFirstValue(formulation, ['id_formuler', 'id'], null),
      id_medicament: normalizeId(pickFirstValue(formulation, ['id_medicament', 'medicament_id'])),
      id_presentation: normalizeId(pickFirstValue(formulation, ['id_presentation', 'presentation_id'])),
      qte_formuler: pickFirstValue(formulation, ['qte_formuler', 'quantite'], '1'),
    });
  };

  const resetFormulationForm = () => {
    setFormulationForm({
      id_formuler: null,
      id_medicament: '',
      id_presentation: '',
      qte_formuler: '1',
    });
  };

  const handleFormulationSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      id_medicament: formulationForm.id_medicament,
      id_presentation: formulationForm.id_presentation,
      qte_formuler: toNumber(formulationForm.qte_formuler, 1),
    };

    try {
      if (formulationForm.id_formuler) {
        await axios.put(
          `${API_URL}medicament/modifformuler`,
          { id_formuler: formulationForm.id_formuler, ...payload },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFormulerList((prev) =>
          prev.map((formulation) =>
            normalizeId(pickFirstValue(formulation, ['id_formuler', 'id'])) ===
            normalizeId(formulationForm.id_formuler)
              ? {
                  ...formulation,
                  ...payload,
                  id_formuler: formulationForm.id_formuler,
                }
              : formulation
          )
        );
      } else {
        const response = await axios.post(`${API_URL}medicament/ajoutformuler`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const savedFormulation =
          response.data && typeof response.data === 'object' && !Array.isArray(response.data)
            ? response.data
            : { ...payload, id_formuler: Date.now() };

        setFormulerList((prev) => [...prev, savedFormulation]);
      }

      resetFormulationForm();
    } catch (error) {
      console.error('Erreur lors de l’enregistrement de la formulation :', error);
    }
  };

  const handleFormulationDelete = async (idFormuler) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette formulation ?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}medicament/supprformuler`, {
        data: { id_formuler: idFormuler },
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormulerList((prev) =>
        prev.filter(
          (formulation) =>
            normalizeId(pickFirstValue(formulation, ['id_formuler', 'id'])) !== normalizeId(idFormuler)
        )
      );
    } catch (error) {
      console.error('Erreur lors de la suppression de la formulation :', error);
    }
  };

  if (loading) {
    return <div className="medicament-table-container medicament-loading-state">Chargement des formulations...</div>;
  }

  return (
    <div className="medicament-table-container">
      <div className="medicament-page-actions">
        <button className="secondary-button" onClick={() => navigate('/dashboardmedicaments')}>
          Retour aux médicaments
        </button>
      </div>

      <section className="medicament-section-card">
        <h3>Ajout, modification et suppression d&apos;une formulation</h3>
        <form onSubmit={handleFormulationSubmit} className="medicament-formulation-form">
          <div>
            <label>Médicament</label>
            <select
              value={formulationForm.id_medicament}
              onChange={(event) =>
                setFormulationForm((prev) => ({ ...prev, id_medicament: event.target.value }))
              }
              required
            >
              <option value="">-- Choisir un médicament --</option>
              {medicamentRows.map((medicament) => {
                const medicamentId = pickFirstValue(medicament, ['id_medicament', 'id']);
                return (
                  <option key={medicamentId} value={normalizeId(medicamentId)}>
                    {medicament.nom_commercial} ({medicament.familleLabel})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label>Présentation</label>
            <select
              value={formulationForm.id_presentation}
              onChange={(event) =>
                setFormulationForm((prev) => ({ ...prev, id_presentation: event.target.value }))
              }
              required
            >
              <option value="">-- Choisir une présentation --</option>
              {presentationList.map((presentation) => {
                const presentationId = pickFirstValue(presentation, ['id_presentation', 'id']);
                return (
                  <option key={presentationId} value={normalizeId(presentationId)}>
                    {pickFirstValue(
                      presentation,
                      ['lib_presentation', 'nom_presentation'],
                      `Présentation ${presentationId}`
                    )}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label>Quantité</label>
            <input
              type="number"
              min="1"
              value={formulationForm.qte_formuler}
              onChange={(event) =>
                setFormulationForm((prev) => ({ ...prev, qte_formuler: event.target.value }))
              }
              required
            />
          </div>

          <div className="medicament-form-actions">
            <button type="submit">{formulationForm.id_formuler ? 'Mettre à jour' : 'Ajouter'}</button>
            <button type="button" onClick={resetFormulationForm} className="secondary-button">
              Réinitialiser
            </button>
          </div>
        </form>

        <div className="medicament-table-wrapper">
          <table className="medicament-table medicament-subtable">
            <thead>
              <tr>
                <th>ID formulation</th>
                <th>Médicament</th>
                <th>Présentation</th>
                <th>Quantité</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {formulationRows.length === 0 && (
                <tr>
                  <td colSpan="5">Aucune formulation disponible.</td>
                </tr>
              )}
              {formulationRows.map((formulation) => {
                const formulationId = pickFirstValue(formulation, ['id_formuler', 'id']);
                return (
                  <tr key={formulationId || `${formulation.medicamentId}-${formulation.presentationId}`}>
                    <td>{formulationId}</td>
                    <td>{formulation.medicamentLabel}</td>
                    <td>{formulation.presentationLabel}</td>
                    <td>{formulation.quantite}</td>
                    <td>
                      <button className="edit-button" onClick={() => handleFormulationEdit(formulation)}>
                        Modifier
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleFormulationDelete(formulationId)}
                      >
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

export default MedicamentFormulationManager;
