import { useEffect, useState, useMemo } from "react";

import notificationsHelper from "../../../helpers/notificationsHelper";
import styles from "./CreateContract.module.css";
import PopupWrapper from "../../../components/popups/PopupWrapper.jsx";
import { useNotification } from "../../../../context/notificationContext";
import ContractCreateForm from "../../../components/forms/ContractCreateForm/ContractCreateForm.jsx";
import PopupformIntervention from "../../../components/forms/PopupFormIntervention/PopupformIntervention.jsx";

import contractsHelper from "../../../helpers/contractsHelper.js";

export default function CreateContract() {
    const [interventionCreationMode, setInterventionCreationMode] =
        useState(false);
    const { notify } = useNotification();

    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10);

    const [interventions, setInterventions] = useState([])
    useEffect(() => {
        console.log("intervention", interventions)
    }, [interventions])

    const addIntervention = ((intervention) => {
        setInterventions(prev => [...prev, intervention])
    })

    const colDefs = [
        { field: "Module", filter: true },
        { field: "Date", filter: true },
        { field: "AM/PM/J", filter: false },
        { field: "Durée", filter: false },
        { field: "Catégorie", filter: false },
        
    ];
    const getDataSource = useMemo(() => ({
        getRows: async (params) => {

            const offset = params.startRow;
            const pageSize = params.endRow - params.startRow;

            const response = await contractsHelper.getContracts(offset, pageSize);

            const rows = interventions.map((intervention) => {
                
                return {
                    id: intervention.id,
                    "Module": intervention.moduleId,
                    "Date": new Date(intervention.dateIntervention).toLocaleDateString(),
                    "AM/PM/J": intervention.shift,
                    "Durée": intervention.hours,
                    "Catégorie": intervention.interventionCategoryId
                    
                 
                }
            }
            );

            // console.log(rows, response.data.total);

            params.successCallback(rows, response.data.total);

        },
    }), [reloadTrigger]);

    const onSearchTextChange = (e) => {
        setSearchText(e.target.value);
        setReloadTrigger(reloadTrigger + 1);
    };
    const onDeleteNotification = async (notification) => {
        const response = await notificationsHelper.deleteNotification(
            notification.id
        );
        if (response && response.success) {
            setReloadTrigger((prev) => prev + 1);
            notify("La notification a bien été supprimée", "success");
        } else {
            notify("Une erreur est survenue", "error");
        }
    };

    const onInterventionCreated = () => {
        setInterventionCreationMode(false);
        setReloadTrigger((prev) => prev + 1);
        notify("La notification a bien été ajoutée", "success");
    };

    return (
        <>
            <div className={styles.mainContainer}>
                {interventionCreationMode && (
                    <>
                        <PopupWrapper
                            title="Créer une intervention"
                            onClose={() => setInterventionCreationMode(false)}
                        >
                            <PopupformIntervention
                                onInterventionCreated={addIntervention}
                            />
                        </PopupWrapper>
                    </>
                )}
                <ContractCreateForm 
                    pageSize ={pageSize}
                    colDefs={colDefs}
                    getDataSource={getDataSource}
                    onSessionCreated={() => { }}
                    showPopup={() => setInterventionCreationMode(true)}
                />
               
            </div>
        </>
    );
}
