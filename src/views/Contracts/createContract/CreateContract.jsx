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
 
    const [interventions, setInterventions] = useState([])

    const addIntervention = ((intervention) => {
        setInterventions(prev => [...prev, intervention])
    })
    const deleteLastIntervention = (() => {
        setInterventions(prev => prev.length > 0 ? prev.slice(0, -1) : prev)

    })


   




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
                                onClose={() => setInterventionCreationMode(false)}
                            />
                        </PopupWrapper>
                    </>
                )}
                <ContractCreateForm 
                   interventions={interventions}
                   deleteIntervention={deleteLastIntervention}
                    onSessionCreated={() => { }}
                    showPopup={() => setInterventionCreationMode(true)}
                />
               
            </div>
        </>
    );
}
