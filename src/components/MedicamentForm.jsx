import React, { useState, useEffect } from 'react';
import '../styles/FraisForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function MedicamentForm({ medicament = null }) {
  const [idMedicament, setIdMedicament] = useState('');
  const [idFamille, setIdFamille] = useState('');
  const [depotLegal, setDepotLegal] = useState('');
  const [nomCommercial, setNomCommercial] = useState('');
  const [effets, setEffets] = useState('');
  const [contreIndication, setContreIndication] = useState('');
  const [prixEchantillon, setPrixEchantillon] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (medicament) {
      setIdMedicament(medicament.id_medicament);
      setIdFamille(medicament.id_famille || '');
      setDepotLegal(medicament.depot_legal || '');
      setNomCommercial(medicament.nom_commercial || '');
      setEffets(medicament.effets || '');
      setContreIndication(medicament.contre_indication || '');
      setPrixEchantillon(medicament.prix_echantillon || '');
    }
  }, [medicament]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        id_famille: idFamille,
        depot_legal: depotLegal,
        nom_commercial: nomCommercial,
        effets,
        contre_indication: contreIndication,
        prix_echantillon: Number(prixEchantillon),
      };

      if (medicament) {
        await axios.put(`${API_URL}medicament/modif`, { id_medicament: idMedicament, ...payload }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}medicament/ajout`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/dashboardmedicaments');
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Erreur lors de l’enregistrement.');
      console.error('Erreur Médicament:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="frais-form-container">
      <h2>{medicament ? 'Modifier un médicament' : 'Ajouter un médicament'}</h2>
      <form className="frais-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Famille (ID)</label>
          <input type="text" value={idFamille} onChange={(e) => setIdFamille(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Dépot légal</label>
          <input type="text" value={depotLegal} onChange={(e) => setDepotLegal(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Nom commercial</label>
          <input type="text" value={nomCommercial} onChange={(e) => setNomCommercial(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Effets</label>
          <input type="text" value={effets} onChange={(e) => setEffets(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Contre indication</label>
          <input type="text" value={contreIndication} onChange={(e) => setContreIndication(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Prix échantillon</label>
          <input type="number" value={prixEchantillon} onChange={(e) => setPrixEchantillon(e.target.value)} required />
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : medicament ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
}
