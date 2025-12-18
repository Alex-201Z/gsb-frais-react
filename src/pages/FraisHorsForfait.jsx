import { useParams } from "react-router-dom";
import React from "react";
import { API_URL } from '../services/authService';
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';


const { id } = useParams();
const [fraisHorsForfaitList, setFraisHorsForfaitList] = useState([]);
const [loading, setLoading] = useState(true);


useEffect(() => {
    const fetchFraisHorsForfaitList = async () => {
        try {
            const response = await axios.get(`${API_URL}fraisHS/liste/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFraisHorsForfaitList(response.data);
            // calcul du total des frais hors forfait 
            let somme = 0;
            response.data.forEach((fraisHorsForfait) => {
                somme += parseFloat(fraisHorsForfait.montant_fraishorsforfait);
            });
            setTotal(somme);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des frais hors forfait:', error);
            setLoading(false);
        }

    }
    fetchFraisHorsForfaitList();
}, []);
return (
    <div>
        {user != null && <FraisHorsForfaitTable fraisHorsForfaitList={fraisHorsForfaitList} frais={id} />}

    </div>
)




export default FraisHorsForfaitliste;