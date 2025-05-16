import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect } from "react";
import contractsHelper from "../../helpers/contractsHelper";

export default function Contracts() {
    const [contracts, setContracts] = useState([]);
    const colDefs = [
        { field: "Nom Prénom", filter: true },
        { field: "Formation", filter: true },
        { field: "Date de Début", filter: false },
        { field: "Date de Fin", filter: false },
        { field: "Heures", filter: false },
        { field: "Signé", filter: false },
        { field: "Déclaré", filter: false },
        { field: "Interventions validées", filter: false },
    ];

    useEffect(() => {
        async function getContracts() {
            const response = await contractsHelper.getContracts();
            const responseContracts = response.data;
            console.log("contracts", responseContracts);
            setContracts(
                //TODO: complete this
                responseContracts.map((contract) => ({
                    "Nom Prénom": contract.user.firstName + " " + contract.user.lastName,
                    "Formation": contract.sessionFormation.formation.name,
                    "Date de Début": new Date(contract.startDate).toLocaleDateString(),
                    "Date de Fin": new Date(contract.endDate).toLocaleDateString(),
                    "Heures": contract.intervention , //somme des temps des interventions
                    "Signé": contract.signed,
                    "Déclaré" : contract.declared,
                    "Interventions validées": contract.validated, //true si toutes les interventions sont validées
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
