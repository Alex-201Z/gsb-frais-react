import React, { useState } from 'react';
import '../styles/FraisForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, API_URL } from '../services/authService';

export default function FraisForm({ frais = null }) {
    const [idFrais, setIdFrais] = useState('null');
    const [anneeMois, setanneeMois] = useState('');
    const [nbJustificatifs, setnbJustificatifs] = useState('');
    const [montant, setmontant] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Pré-remplir le formulaire si on modifie un frais existant 
    useEffect(() => {
        if (frais) {
            setIdFrais(frais.id_frais);
            setMontant(frais.montantvalide || '');
            // TODO : compléter en affectant la valeur à anneeMois et nbJustificatifs 

            setanneeMois(frais.anneemois);
            setnbJustificatifs(frais.nbjustificatifs);
        }
    }, [frais]);




    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (frais) {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token manquant');
                }
                const fraisData = {
                    anneemois: anneeMois,
                    nbjustificatifs: parseInt(nbJustificatifs, 10),
                    id_visiteur: getCurrentUser()["id_visiteur"]
                };
                const response = await
                    axios.post(`${API_URL}frais/ajout`, fraisData, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                console.log(response)
                navigate('/dashboard');
            } else { 

            }

        } catch (err) {
            console.error('Erreur:', err);
            setError(err.response?.data?.message || err.message ||
                'Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }

    }


    return (

        <div className="frais-form-container">
            <center><h1>Saisir un frais</h1></center>

            <form className="frais-form" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Année-Mois :</label>
                    <input
                        type="text"
                        value={anneeMois}
                        onChange={(e) => setanneeMois(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Nombre de Justificatifs :</label>
                    <input
                        type="number"
                        value={nbJustificatifs}
                        onChange={(e) => setnbJustificatifs(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Montant :</label>
                    <input
                        type="number"
                        value={montant}
                        onChange={(e) => setmontant(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Ajouter'}
                </button>

            </form>
        </div>
    );
}