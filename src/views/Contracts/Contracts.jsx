import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect, useMemo, useContext } from "react";
import contractsHelper from "../../helpers/contractsHelper";
import styles from "./Contracts.module.css";
import { Link } from "react-router";
import { UserContext } from "../../../context/userContext";

export default function Contracts() {

    const colDefs = [
        { field: "Nom Prénom", filter: true },
        { field: "Formation", filter: true },
        { field: "Date de Début", filter: false },
        { field: "Date de Fin", filter: false },
        { field: "Heures", filter: false },
        { field: "Signé", filter: false },
        { field: "Déclaré", filter: false },
        { field: "Interventions", filter: false },
    ];

    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const { user } = useContext(UserContext);
    const getDataSource = useMemo(() => ({
        getRows: async (params) => {

            const offset = params.startRow;
            const pageSize = params.endRow - params.startRow;
            let filter = null;
            if (!user.isAdmin) {
                filter = `{"userId":"${user.id}"}`

            }
            const response = await contractsHelper.getContracts(offset, pageSize, searchText, filter);

            const rows = response.data.contracts.map((contract) => {
                const hasUnvalidatedInterventions = contract?.Interventions?.some(
                    (intervention) => !intervention.validatedByAdmin || !intervention.validatedByFormateur
                );
                return {
                    id: contract.id,
                    "Nom Prénom": contract.User.firstName + " " + contract.User.lastName,
                    "Formation": contract.SessionFormation.Formation.name,
                    "Date de Début": new Date(contract.startDate).toLocaleDateString(),
                    "Date de Fin": new Date(contract.endDate).toLocaleDateString(),
                    "Heures": contract.intervention, //somme des temps des interventions
                    "Signé": contract.signed,
                    "Déclaré": contract.declared,
                    "Interventions": hasUnvalidatedInterventions,
                }
            }
            );
            if (searchText.length > 0) {
                setPageSize(rows.length);
            } else {
                setPageSize(pageSize);
            }
            // console.log(rows, response.data.total);

            params.successCallback(rows, response.data.total);

        },
    }), [reloadTrigger]);

    const onSearchTextChange = (e) => {
        setSearchText(e.target.value);
        setReloadTrigger(reloadTrigger + 1);
    };

    return (
        <>

            <div className={styles.mainContainer}>
                {
                    user.isAdmin &&
                    <>
                        <Link to="/dashboard/contracts/create" className="btn btn-add" >
                            Créer un contrat
                        </Link>
                        <input type="text" placeholder="Rechercher" value={searchText} onChange={(e) => onSearchTextChange(e)} />
                    </>
                }
                <DataGrid pageSize={pageSize} colDefs={colDefs} data={getDataSource}
                />
            </div>

        </>
    );
}






