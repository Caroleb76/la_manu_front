import { useState} from "react";

import notificationsHelper from "../../../helpers/notificationsHelper";
import styles from "./CreateContract.module.css";
import PopupWrapper from "../../../components/popups/PopupWrapper.jsx";
import { useNotification } from "../../../../context/notificationContext";
import ContractCreateForm from "../../../components/forms/ContractCreateForm/ContractCreateForm.jsx";
import PopupformNotification from "../../../components/forms/PopupFormNotification/PopupformNotification.jsx";

export default function CreateContract() {
    const [interventionCreationMode, setInterventionCreationMode] =
        useState(false);
    const { notify } = useNotification();

    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [searchText, setSearchText] = useState("");

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
                            title="Créer une notification"
                            onClose={() => setInterventionCreationMode(false)}
                        >
                            <PopupformNotification
                                onNotificationCreated={onInterventionCreated}
                            />
                        </PopupWrapper>
                    </>
                )}
                <ContractCreateForm
                    onSessionCreated={() => {}}
                    showPopup={setInterventionCreationMode(true)}
                />
            </div>
        </>
    );
}
