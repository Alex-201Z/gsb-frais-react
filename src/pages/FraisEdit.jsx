import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


export default function FraisEdit() {
    const { id } = useParams();
    const { frais } = useState(null);
    const { loading, setLoading } = useState(true);

    useEffect(() => {
        const fetchFrais = async () => {
            try {
                const token = localStorage.getItem('token');
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
    }, [id]);
    if (loading) {
        return <div>Chargement...</div>;
    }

}
return (
    <div>
        {user != null && (<FraisForm frais={frais} />)}
            </div>
);
