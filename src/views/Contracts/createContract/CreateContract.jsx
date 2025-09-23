import { useEffect, useState, useMemo, useContext } from "react";
import { UserContext } from "../../../../context/userContext";

import { useParams } from "react-router";
import notificationsHelper from "../../../helpers/notificationsHelper";
import styles from "./CreateContract.module.css";
import PopupWrapper from "../../../components/popups/PopupWrapper.jsx";
import { useNotification } from "../../../../context/notificationContext";
import ContractCreateForm from "../../../components/forms/ContractCreateForm/ContractCreateForm.jsx";
import PopupFormIntervention from "../../../components/forms/PopupFormIntervention/PopupformIntervention.jsx";

import contractsHelper from "../../../helpers/contractsHelper.js";

export default function CreateContract() {
    let { contractId } = useParams();

    const { user } = useContext(UserContext);

    const [interventionCreationMode, setInterventionCreationMode] =
        useState(false);
    const { notify } = useNotification();
    const [reloadTrigger, setReloadTrigger] = useState(0);

    const [interventions, setInterventions] = useState([]);
    const [selectedFormationId, setSelectedFormationId] = useState(null);

    const addIntervention = (intervention) => {
        const extraCosts = intervention.extraCosts.map((extraCost) => ({
                categoryId: extraCost,
                val:""
            }))
        const formattedIntervention = {
            ...intervention,
            ModuleFormation: {
                id: intervention.moduleId,
                name: intervention.moduleName,
            },
            
            InterventionCategory: {
                id: intervention.interventionCategoryId,
                name: intervention.interventionCategoryName,
            },
            extraCosts , 
        };
        setInterventions((prev) => [...prev, formattedIntervention]);
    };
    const deleteLastIntervention = (index) => {
// Remove the intervention at the specified index
        setInterventions((prev) =>
            prev.filter((_, i) => i !== index)
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
                            <PopupFormIntervention
                                onInterventionCreated={addIntervention}
                                onClose={() =>
                                    setInterventionCreationMode(false)
                                }
                                sessionFormation={selectedFormationId}
                            />
                        </PopupWrapper>
                    </>
                )}

                <ContractCreateForm
                    userRole={user.role}
                    contractId={contractId ?? null}
                    interventions={interventions}
                    deleteIntervention={deleteLastIntervention}
                    showPopup={() => setInterventionCreationMode(true)}
                    onSelectedSession={onSessionFormationSelected}
                />
            </div>
        </>
    );
}
