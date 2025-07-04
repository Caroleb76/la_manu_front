import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect, useMemo } from "react";
import notificationsHelper from "../../helpers/notificationsHelper";
import styles from "./Notifications.module.css";
import PopupWrapper from "../../components/popups/PopupWrapper.jsx";
import { useNotification } from "../../../context/notificationContext";
import PopupformNotification from "../../components/forms/PopupFormNotification/PopupformNotification.jsx";


function Notifications() {
    const [notificationCreationMode, setNotificationCreationMode] =
        useState(false);
    const { notify } = useNotification();
    const dataGridRef = null;
    const colDefs = [
        { field: "Titre", filter: true },
        { field: "Priorité", filter: true },
        { field: "Contenu", filter: true },
        { field: "Date de début", filter: false },
        { field: "Date de fin", filter: false },
        { field: "Actions", filter: false },
    ];

    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const getDataSource = useMemo(() => ({
        getRows: async (params) => {

            const offset = params.startRow;
            const pageSize = params.endRow - params.startRow;

            const response = await notificationsHelper.getNotifications(offset, pageSize, searchText);

            const rows = response.data.notifications.map((notification) => ({
                id: notification.id,
                Titre: notification.title,
                Priorité: notification.priority,
                Contenu: notification.content,
                isActive: new Date(notification.endDate) > new Date(),
                "Date de début": new Date(notification.startDate).toLocaleDateString(),
                "Date de fin": new Date(notification.endDate).toLocaleDateString(),
            }))
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
        if (e.target.value.length < 3 && e.target.value.length > 0) return;
        setReloadTrigger(prev => prev + 1);
    }

    const onDeleteNotification = async (notificaiton) => {
        
        
        const response = await notificationsHelper.deleteNotification(notificaiton.id);
        if (response && response.success) {
            setReloadTrigger(prev => prev + 1);
            notify("La notification a bien été supprimée", "success");
        }else{
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
                      {notificationCreationMode && (
                    <>
                        <PopupWrapper
                        title="Créer une notification"
                            onClose={() => setNotificationCreationMode(false)}
                        >
                            <PopupformNotification
                                onNotificationCreated={onNotificationCreated}
                            />
                        </PopupWrapper>
                    </>
                )}
                <button
                    className={styles.addButton}
                    onClick={() => setNotificationCreationMode(true)}
                >
                    Créer
                </button>
                <input type="text" placeholder="Rechercher" value={searchText} onChange={(e) => onSearchTextChange(e)} />
                <DataGrid  pageSize={pageSize}
                onActionClick={onDeleteNotification}
                colDefs={colDefs} data={getDataSource}

                    renderIconWithCondition={(row) => "ic:baseline-delete-outline"}
                    iconStyle={(row) => { return { color: "red" } }} />
            </div>
        </>
    );
}

export default Notifications;
