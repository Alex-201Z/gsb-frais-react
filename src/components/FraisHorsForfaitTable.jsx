import FraisHorsForfaitliste from "../pages/FraisHorsForfait";

const FraisHorsForfaitTable = ({ fraisHorsForfaitList, frais, total }) => {
    return (
        <div>
            <h2>Liste des frais hors forfait</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID État</th>
                        <th>Année-Mois</th>
                        <th>ID Visiteur</th>
                        <th>Nombre de justificatifs</th>
                        <th>Date de modification</th>
                        <th>Montant saisi</th>
                        <th>Montant validé</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {fraisHorsForfaitList.map((fraisHorsForfait) => (
                        <tr key={fraisHorsForfait.id}>
                            <td>{fraisHorsForfait.id_etat}</td>
                            <td>{fraisHorsForfait.anneemois}</td>
                            <td>{fraisHorsForfait.id_visiteur}</td>
                            <td>{fraisHorsForfait.nbjustificatifs}</td>
                            <td>{fraisHorsForfait.datemodification}</td>
                            <td>{fraisHorsForfait.montantSaisi}</td>
                            <td>{fraisHorsForfait.montantvalide}</td>
                            <td>
                                <button onClick={() => navigate(`/fraisHS/ajout`)}
                                    className="edit-button"
                                >
                                    ajouter
                                </button>
                                <button onClick={() => navigate(`/frais/modifier/${fraisHorsForfait.id_frais}`)}
                                    className="edit-button"
                                >
                                    Modifier
                                </button>
                                <button onClick={() => handleDelete(fraisHorsForfait.id_frais)}
                                    className="delete-button"
                                >
                                    Supression
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FraisHorsForfaitTable;