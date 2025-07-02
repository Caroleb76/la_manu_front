import DataGrid from "../../../components/DataGrid/DataGrid";
import { useState, useEffect, useMemo } from "react";
import contractsHelper from "../../../helpers/contractsHelper";
import notificationsHelper from "../../../helpers/notificationsHelper";
import styles from "./createContract.module.css";
import PopupWrapper from "../../../components/popups/PopupWrapper.jsx";
import { useNotification } from "../../../../context/notificationContext";

export default function Contracts() {
    const [interventionCreationMode, setInterventionCreationMode] = useState(false);
    const colDefs = [
        { field: "Module", filter: true },
        { field: "Date", filter: true },
        { field: "AM/PM/J", filter: false },
        { field: "Durée", filter: false },
        { field: "Catégorie", filter: false },
        { field: "Tarif horaire", filter: false },
        { field: "Montant", filter: false },
    ];

    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const getDataSource = useMemo(() => ({
        getRows: async (params) => {

            const offset = params.startRow;
            const pageSize = params.endRow - params.startRow;

            const response = await contractsHelper.getContracts(offset, pageSize, searchText);

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
    const onDeleteNotification = async (notification) => {


        const response = await notificationsHelper.deleteNotification(notification.id);
        if (response && response.success) {
            setReloadTrigger(prev => prev + 1);
            notify("La notification a bien été supprimée", "success");
        } else {
            notify("Une erreur est survenue", "error");
        }
    }

    const onNotificationCreated = () => {
        setNotificationCreationMode(false);
        setReloadTrigger(prev => prev + 1);
        notify("La notification a bien été ajoutée", "success");
    }

    return (
        <>
            <div className={styles.mainContainer}>
                {interventionCreationMode && (
                    <>
                        <PopupWrapper
                            title="Créer une intervention"
                            onClose={() => setInterventionCreationMode(false)}
                        >
                            <PopupFormNotification
                                onInterventionCreated={onInterventionCreated}
                            />
                        </PopupWrapper>
                    </>
                )}
                <button
                    className={styles.addButton}
                    onClick={() => setInterventionCreationMode(true)}
                >
                    Créer
                </button>
                <input type="text" placeholder="Rechercher" value={searchText} onChange={(e) => onSearchTextChange(e)} />
                <DataGrid pageSize={pageSize} colDefs={colDefs} data={getDataSource}
                />
            </div>

        </>
    );
}






