import React, { useState, useEffect } from 'react';
import '../styles/FraisForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, API_URL } from '../services/authService';
import { useAuth } from '../context/AuthContext';


export default function FraisForm({ frais = null }) {
    const [idFrais, setIdFrais] = useState('null');
    const [anneeMois, setanneeMois] = useState('');
    const [nbJustificatifs, setnbJustificatifs] = useState('');
    const [montant, setMontant] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useAuth();



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
            const fraisData = {
                anneemois: anneeMois,
                nbjustificatifs: parseInt(nbJustificatifs, 10),
            };
            if (frais) {// Mise à jour d'un frais existant (UPDATE) 
                fraisData["id_frais"] = idFrais; // ajoute id_frais au JSON fraisData
                fraisData["montantvalide"] = parseFloat(montant);

                // TODO : compléter la requête 

                const response = await axios.post(
                    `${API_URL}frais/modif`,
                    fraisData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                    // TODO : passer l’url de modification (voir le tableau au début du doc),  
                    // TODO : passer l’objet JSON du body, 
                    // TODO : passer le token dans les headers 

                );
                console.log(response)
            } else { // Ajout d'un nouveau frais (CREATE) 

                // TODO : Ajouter id_visiteur à fraisData 
                fraisData["id_visiteur"] = getCurrentUser().id_visiteur;
                const response = await axios.post(`${API_URL}frais/ajout`,

                    fraisData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response)
            }
            navigate('/dashboard'); 

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
            <center><h2>{frais ? 'Modifier le frais' : 'Saisir un frais'}</h2> </center>

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
                        onChange={(e) => setMontant(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Enregistrement...' : (frais ? 'Mettre à jour le frais' : 'Ajouter le frais')}

                </button>

            </form>
        </div>
    );
}