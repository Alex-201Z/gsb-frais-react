import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../services/authService';
import MedicamentForm from '../components/MedicamentForm';
import { useAuth } from '../context/AuthContext';

export default function MedicamentEdit() {
  const { id } = useParams();
  const [medicament, setMedicament] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchMedicament = async () => {
      try {
        const response = await axios.get(`${API_URL}medicament/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedicament(response.data);
      } catch (error) {
        console.error('Erreur lors de récupération du médicament :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicament();
  }, [id, user, token]);

  if (!user) return <div>Vous devez être connecté pour modifier un médicament.</div>;
  if (loading) return <div>Chargement du médicament...</div>;

  return (
    <div>
      <MedicamentForm medicament={medicament} />
    </div>
  );
}
