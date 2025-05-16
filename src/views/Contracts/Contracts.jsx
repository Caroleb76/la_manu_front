import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect } from "react";
import contractsHelper from "../../helpers/contractsHelper";

export default function Contracts() {
    const [contracts, setContracts] = useState([]);
    const colDefs = [
        { field: "Email", filter: true },
        { field: "Nom", filter: true },
        { field: "Prenom", filter: true },
        { field: "Role", filter: true },
        { field: "Actions", filter: false },
    ];

    useEffect(() => {
        async function getContracts() {
            const response = await contractsHelper.getContracts();
            const responseContracts = response.data;
            console.log("rolename", responseContracts);
            setContracts(
                //TODO: complete this
                responseContracts.map((contract) => ({
                    Nom_Prénom: contract.user.firstName + " " + contract.user.lastName,
                    Formation: contract.sessionFormation.formation.name,
                    Date_de_debut: contract.startDate,
                    Date_de_fun: contract.endDate,
                    Heures: contract.intervention , //somme des temps des interventions
                    Signé: contract.signed,
                    Déclaré : contract.declared,
                    Interventions_validées: contract.validated, //true si toutes les interventions sont validées
                    Action: ""
                }))
            );
        }
        getContracts();
    }, []);
    return (
        <div>
            <title>Contracts</title>
            <DataGrid colDefs={colDefs} data={contracts} />
        </div>
    );
}
