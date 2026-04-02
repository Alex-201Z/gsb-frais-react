import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../services/authService';
import FraisForm from '../components/FraisForm';
import { useAuth } from '../context/AuthContext';


export default function FraisEdit() {
    const { id } = useParams();
    const [ frais, setFrais ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const { user, token } = useAuth();
    

    useEffect(() => {
        if (!user || !token) {
            setLoading(false);
            return;
        }

        const fetchFrais = async () => {
            try {
                const response = await axios.get(`${API_URL}frais/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFrais(response.data);
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFrais();
    }, [id, token, user]);

        if (loading) {
            return <div className="frais-table-container medicament-loading-state">Chargement du frais...</div>;
        }

        return (
            <div>
                {user != null && (<FraisForm frais={frais} />)}
            
            </div>
    
        );

}

