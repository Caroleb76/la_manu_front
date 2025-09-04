import { useEffect, useState, useMemo } from "react";

import notificationsHelper from "../../../helpers/notificationsHelper.js";
import styles from "./SignContract.module.css";
import PopupWrapper from "../../../components/popups/PopupWrapper.jsx";
import { useNotification } from "../../../../context/notificationContext.jsx";
import PopupformIntervention from "../../../components/forms/PopupFormIntervention/PopupformIntervention.jsx";
import ContractEditForm from "../../../components/forms/ContractEditForm/ContractEditForm.jsx";
import { useParams } from "react-router";

import contractsHelper from "../../../helpers/contractsHelper.js";

export default function EditContract() {
    let { contractId } = useParams();
    
    const [interventionCreationMode, setInterventionCreationMode] =
        useState(false);
    const { notify } = useNotification();
    const [reloadTrigger, setReloadTrigger] = useState(0);

    const [interventions, setInterventions] = useState([]);
    const [selectedFormationId, setSelectedFormationId] = useState(null);

    const addIntervention = (intervention) => {
        setInterventions((prev) => [...prev, intervention]);
    };
    const deleteLastIntervention = (all = false) => {
        if (all) {
            setInterventions([]);
            return;
        }
        setInterventions((prev) =>
            prev?.length > 0 ? prev.slice(0, -1) : prev
        );
    };

    const onSessionFormationSelected = (formationId) => {
        setSelectedFormationId(formationId);
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
                                onClose={() =>
                                    setInterventionCreationMode(false)
                                }
                                sessionFormation={selectedFormationId}
                            />
                        </PopupWrapper>
                    </>
                )}
                <ContractEditForm
                contractId={contractId}
                    interventions={interventions}
                    deleteIntervention={deleteLastIntervention}
                    showPopup={() => setInterventionCreationMode(true)}
                    onSelectedSession={onSessionFormationSelected}
                />
            </div>
        </>
    );
}
