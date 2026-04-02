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

function PresentationComponentsTable() {
  const [medicamentList, setMedicamentList] = useState([]);
  const [presentationList, setPresentationList] = useState([]);
  const [formulerList, setFormulerList] = useState([]);
  const [composantList, setComposantList] = useState([]);
  const [constituerList, setConstituerList] = useState([]);
  const [selectedPresentationId, setSelectedPresentationId] = useState('');
  const [selectedPresentationComposants, setSelectedPresentationComposants] = useState([]);
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
        const { data } = await fetchMedicamentData(token, [
          'medicaments',
          'presentations',
          'formuler',
          'composants',
          'constituer',
        ]);

        if (!active) {
          return;
        }

        setMedicamentList(data.medicaments || []);
        setPresentationList(data.presentations || []);
        setFormulerList(data.formuler || []);
        setComposantList(data.composants || []);
        setConstituerList(data.constituer || []);
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

  const medicamentMap = useMemo(() => {
    const map = new Map();
    medicamentList.forEach((medicament) => {
      const medicamentId = pickFirstValue(medicament, ['id_medicament', 'id']);
      if (medicamentId !== '') {
        map.set(normalizeId(medicamentId), medicament);
      }
    });
    return map;
  }, [medicamentList]);

  const composantMap = useMemo(() => {
    const map = new Map();
    composantList.forEach((composant) => {
      const composantId = pickFirstValue(composant, ['id_composant', 'id']);
      if (composantId !== '') {
        map.set(normalizeId(composantId), composant);
      }
    });
    return map;
  }, [composantList]);

  const formulationRows = useMemo(
    () =>
      formulerList.map((formulation) => {
        const medicamentId = pickFirstValue(formulation, ['id_medicament', 'medicament_id']);
        const presentationId = pickFirstValue(formulation, ['id_presentation', 'presentation_id']);
        const medicament = medicamentMap.get(normalizeId(medicamentId));

        return {
          ...formulation,
          medicamentId,
          presentationId,
          medicamentLabel:
            medicament?.nom_commercial || medicament?.nom_medicament || `Médicament ${medicamentId}`,
          quantite: pickFirstValue(formulation, ['qte_formuler', 'quantite'], ''),
        };
      }),
    [formulerList, medicamentMap]
  );

  const selectedPresentation = presentationMap.get(normalizeId(selectedPresentationId));

  const loadComponentsByPresentation = async (presentationId) => {
    setSelectedPresentationId(presentationId);
    setSelectedPresentationComposants([]);

    if (!presentationId) {
      return;
    }

    try {
      const response = await axios.get(`${API_URL}medicament/composantsparpresentation/${presentationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPresentationComposants(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.warn('Chargement direct des composants par présentation indisponible, calcul local utilisé.', error);
    }
  };

  const composantsForPresentation = useMemo(() => {
    if (!selectedPresentationId) {
      return [];
    }

    if (selectedPresentationComposants.length) {
      return selectedPresentationComposants.map((composant) => {
        const composantId = pickFirstValue(composant, ['id_composant', 'id']);
        const existingComposant = composantMap.get(normalizeId(composantId));

        return {
          key: normalizeId(composantId) || `${pickFirstValue(composant, ['lib_composant', 'nom_composant'])}`,
          composantLabel:
            pickFirstValue(composant, ['lib_composant', 'nom_composant']) ||
            pickFirstValue(existingComposant, ['lib_composant', 'nom_composant'], `Composant ${composantId}`),
          medicamentLabel:
            pickFirstValue(composant, ['nom_commercial', 'lib_medicament', 'medicament']) || 'Calcul API',
          qteComposant: pickFirstValue(composant, ['qte_composant', 'quantite_composant'], '-'),
          qteTotale: pickFirstValue(composant, ['qte_totale', 'quantite_totale'], '-'),
        };
      });
    }

    const aggregatedComponents = new Map();

    formulationRows
      .filter((formulation) => normalizeId(formulation.presentationId) === normalizeId(selectedPresentationId))
      .forEach((formulation) => {
        const quantityFormuler = toNumber(formulation.quantite, 1) || 1;

        constituerList
          .filter(
            (constitution) =>
              normalizeId(pickFirstValue(constitution, ['id_medicament', 'medicament_id'])) ===
              normalizeId(formulation.medicamentId)
          )
          .forEach((constitution) => {
            const composantId = pickFirstValue(constitution, ['id_composant', 'composant_id']);
            const composant = composantMap.get(normalizeId(composantId));
            const quantityComposant = toNumber(
              pickFirstValue(constitution, ['qte_composant', 'quantite'], 1),
              1
            );
            const key = normalizeId(composantId);
            const existing = aggregatedComponents.get(key) || {
              key,
              composantLabel:
                pickFirstValue(composant, ['lib_composant', 'nom_composant'], `Composant ${composantId}`),
              medicamentSet: new Set(),
              qteComposant: 0,
              qteTotale: 0,
            };

            existing.medicamentSet.add(formulation.medicamentLabel);
            existing.qteComposant += quantityComposant;
            existing.qteTotale += quantityComposant * quantityFormuler;

            aggregatedComponents.set(key, existing);
          });
      });

    return Array.from(aggregatedComponents.values())
      .map((component) => ({
        ...component,
        medicamentLabel: Array.from(component.medicamentSet).join(', '),
      }))
      .sort((first, second) => first.composantLabel.localeCompare(second.composantLabel));
  }, [
    composantMap,
    constituerList,
    formulationRows,
    selectedPresentationComposants,
    selectedPresentationId,
  ]);

  if (loading) {
    return <div className="medicament-table-container medicament-loading-state">Chargement des composants...</div>;
  }

  return (
    <div className="medicament-table-container">
      <div className="medicament-page-actions">
        <button className="secondary-button" onClick={() => navigate('/dashboardmedicaments')}>
          Retour aux médicaments
        </button>
      </div>

      <section className="medicament-section-card">
        <h3>Affichage des composants par présentation</h3>
        <div className="medicament-presentation-picker">
          <select
            value={selectedPresentationId}
            onChange={(event) => loadComponentsByPresentation(event.target.value)}
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
          {selectedPresentation && (
            <p className="medicament-inline-note">
              Présentation sélectionnée :{' '}
              {pickFirstValue(
                selectedPresentation,
                ['lib_presentation', 'nom_presentation'],
                `Présentation ${selectedPresentationId}`
              )}
            </p>
          )}
        </div>

        <div className="medicament-table-wrapper">
          <table className="medicament-table medicament-subtable">
            <thead>
              <tr>
                <th>Composant</th>
                <th>Médicament(s)</th>
                <th>Qté composant</th>
                <th>Qté totale</th>
              </tr>
            </thead>
            <tbody>
              {!selectedPresentationId && (
                <tr>
                  <td colSpan="4">Choisissez une présentation pour afficher ses composants.</td>
                </tr>
              )}
              {selectedPresentationId && composantsForPresentation.length === 0 && (
                <tr>
                  <td colSpan="4">Aucun composant trouvé pour cette présentation.</td>
                </tr>
              )}
              {composantsForPresentation.map((composant) => (
                <tr key={composant.key}>
                  <td>{composant.composantLabel}</td>
                  <td>{composant.medicamentLabel}</td>
                  <td>{composant.qteComposant}</td>
                  <td>{composant.qteTotale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default PresentationComponentsTable;
