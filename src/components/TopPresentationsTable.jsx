import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchMedicamentData,
  normalizeId,
  pickFirstValue,
  toNumber,
} from '../services/medicamentService';
import '../styles/FraisTable.css';

function TopPresentationsTable() {
  const [presentationList, setPresentationList] = useState([]);
  const [formulerList, setFormulerList] = useState([]);
  const [prescrireList, setPrescrireList] = useState([]);
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
        const { data } = await fetchMedicamentData(token, ['presentations', 'formuler', 'prescrire']);

        if (!active) {
          return;
        }

        setPresentationList(data.presentations || []);
        setFormulerList(data.formuler || []);
        setPrescrireList(data.prescrire || []);
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

  const formulationRows = useMemo(
    () =>
      formulerList.map((formulation) => ({
        ...formulation,
        medicamentId: pickFirstValue(formulation, ['id_medicament', 'medicament_id']),
        presentationId: pickFirstValue(formulation, ['id_presentation', 'presentation_id']),
        quantite: pickFirstValue(formulation, ['qte_formuler', 'quantite'], ''),
      })),
    [formulerList]
  );

  const topPresentationsSource = prescrireList.length > 0 ? 'prescrire' : 'formuler';

  const topPresentations = useMemo(() => {
    const countMap = new Map();

    const addCount = (presentationId, value) => {
      const key = normalizeId(presentationId);
      if (!key) {
        return;
      }

      countMap.set(key, (countMap.get(key) || 0) + value);
    };

    if (prescrireList.length > 0) {
      prescrireList.forEach((prescription) => {
        const prescriptionWeight =
          toNumber(
            pickFirstValue(
              prescription,
              ['qte_prescrire', 'nb_prescription', 'nb_prescriptions', 'quantite'],
              1
            ),
            1
          ) || 1;

        const directPresentationId = pickFirstValue(prescription, ['id_presentation', 'presentation_id']);
        if (directPresentationId) {
          addCount(directPresentationId, prescriptionWeight);
          return;
        }

        const medicamentId = pickFirstValue(prescription, ['id_medicament', 'medicament_id']);
        formulationRows
          .filter((formulation) => normalizeId(formulation.medicamentId) === normalizeId(medicamentId))
          .forEach((formulation) => addCount(formulation.presentationId, prescriptionWeight));
      });
    } else {
      formulationRows.forEach((formulation) => {
        addCount(formulation.presentationId, toNumber(formulation.quantite, 1) || 1);
      });
    }

    return Array.from(countMap.entries())
      .map(([presentationId, total]) => {
        const presentation = presentationMap.get(presentationId);
        return {
          id_presentation: presentationId,
          lib_presentation:
            pickFirstValue(presentation, ['lib_presentation', 'nom_presentation'], '') ||
            `Présentation ${presentationId}`,
          qte_prescrite: total,
        };
      })
      .sort((first, second) => second.qte_prescrite - first.qte_prescrite)
      .slice(0, 10);
  }, [formulationRows, presentationMap, prescrireList]);

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
        <p className="medicament-inline-note">
          Source de calcul : {topPresentationsSource === 'prescrire' ? 'table prescrire' : 'repli sur formuler'}.
        </p>

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
                  <td>{presentation.qte_prescrite}</td>
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
