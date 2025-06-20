import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect, useMemo } from "react";
import notificationsHelper from "../../helpers/notificationsHelper";
import styles from "./Notifications.module.css";
import PopupCreateNotification from "../PopupCreateNotification/PopupCreateNotification";
import { useNotification } from "../../../context/notificationContext";


function Notifications() {
    const [notificationCreationMode, setNotificationCreationMode] = useState(false);
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
    const [reloadTrigger, setReloadTrigger] = useState(0);

    function refreshDataGrid() {
        setReloadTrigger(prev => prev + 1);
        if (dataGridRef?.current) dataGridRef.current.refreshData();
    }
    const onNotificationCreated = () => {
        setNotificationCreationMode(false);
        refreshDataGrid();
        notify("La notification a bien été ajoutée", "success");
    }
    const getDataSource = useMemo(() => ({
        getRows: async (params) => {

            const offset = params.startRow;
            const pageSize = params.endRow - params.startRow;

            const response = await notificationsHelper.getNotifications(offset, pageSize);

            const rows = response.data.notifications.map((notification) => ({
                id: notification.id,
                Titre: notification.title,
                Priorité: notification.priority,
                Contenu: notification.content,
                isActive: new Date(notification.endDate) > new Date(),
                "Date de début": new Date(notification.startDate).toLocaleDateString(),
                "Date de fin": new Date(notification.endDate).toLocaleDateString(),
            }))
            // console.log(rows, response.data.total);

            params.successCallback(rows, response.data.total);

        },
    }), [reloadTrigger]);

    return (
        <>
            <div className={styles.mainContainer}>
                {notificationCreationMode && <PopupCreateNotification onClose={() => setNotificationCreationMode(false)} onNotificationCreated={onNotificationCreated} />}
                <button className={styles.addButton} onClick={() => setNotificationCreationMode(true)}>Créer</button>
                <DataGrid colDefs={colDefs} data={getDataSource}
                    renderIconWithCondition={(row) => row?.isActive ? "material-symbols:check-circle"
                        : "material-symbols:cancel"}
                    iconStyle={(row) => row?.isActive ? { color: "green" } : { color: "red" }} />
            </div>

        </>
    );
}

export default Notifications;
