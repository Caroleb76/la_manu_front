import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect, useMemo } from "react";
import contractsHelper from "../../helpers/contractsHelper";
import styles from "./Contracts.module.css";

export default function Contracts() {

    const colDefs = [
        { field: "Nom Prénom", filter: true },
        { field: "Formation", filter: true },
        { field: "Date de Début", filter: false },
        { field: "Date de Fin", filter: false },
        { field: "Heures", filter: false },
        { field: "Signé", filter: false },
        { field: "Déclaré", filter: false },
        { field: "I.validées", filter: false },
    ];

    const [reloadTrigger, setReloadTrigger] = useState(0);
    const getDataSource = useMemo(() => ({
        getRows: async (params) => {

            const offset = params.startRow;
            const pageSize = params.endRow - params.startRow;

            const response = await contractsHelper.getContracts(offset, pageSize);

            const rows = response.data.contracts.map((contract) => ({
                    id: contract.id,
                    "Nom Prénom": contract.User.firstName + " " + contract.User.lastName,
                    "Formation": contract.SessionFormation.Formation.name,
                    "Date de Début": new Date(contract.startDate).toLocaleDateString(),
                    "Date de Fin": new Date(contract.endDate).toLocaleDateString(),
                    "Heures": contract.intervention, //somme des temps des interventions
                    "Signé": contract.signed,
                    "Déclaré": contract.declared,
                    "I.validées": contract.validated, //true si toutes les interventions sont validées
                }))
            // console.log(rows, response.data.total);

            params.successCallback(rows, response.data.total);

        },
    }), [reloadTrigger]);

    return (
        <>
            <div className={styles.mainContainer}>

                <DataGrid colDefs={colDefs} data={getDataSource}
                />
            </div>

        </>
    );
}






