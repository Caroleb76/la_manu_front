import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect, useMemo } from "react";
import notificationsHelper from "../../helpers/notificationsHelper";
import styles from "./Notifications.module.css";
import PopupWrapper from "../../components/popups/PopupWrapper.jsx";
import { useNotification } from "../../../context/notificationContext";
import PopupformNotification from "../../components/forms/PopupFormNotification/PopupformNotification.jsx";
import { PRIORITIES } from "../../utils/constants.js";

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
    const [rows, setRows] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const convertRow = (notification) => ({
        id: notification.id,
        Titre: notification.title,
        Priorité: PRIORITIES[notification.priority],
        Contenu: notification.content,
        isActive: new Date(notification.endDate) > new Date(),
        "Date de début": new Date(
            notification.startDate
        ).toLocaleDateString(),
        "Date de fin": new Date(
            notification.endDate
        ).toLocaleDateString(),
    });

    const fetchData = async () => {
        const response = await notificationsHelper.getNotifications();
        const data = response.data.notifications.map(convertRow);
        setRows(data);
    }


    const onDeleteNotification = async (notification) => {
        const response = await notificationsHelper.deleteNotification(
            notification.id
        );
        if (response && response.success) {
            setRows((prev) => prev.filter((row) => row.id !== notification.id));
            notify("La notification a bien été supprimée", "success");
        } else {
            notify("Une erreur est survenue", "error");
        }
    };

    const onNotificationCreated = () => {
        setNotificationCreationMode(false);
       fetchData();
        notify("La notification a bien été ajoutée", "success");
    };

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
                <div className={styles.btnContainer}>
                    <button
                        className="btn"
                        onClick={() => setNotificationCreationMode(true)}
                    >
                        Créer
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Rechercher"
                    value={searchText}
                    onChange={(e) => onSearchTextChange(e)}
                />
                <DataGrid
                    pageSize={pageSize}
                    onActionClick={onDeleteNotification}
                    colDefs={colDefs}
                    rowData={rows}
                    renderIconWithCondition={(row) =>
                        "ic:baseline-delete-outline"
                    }
                    iconStyle={(row) => {
                        return { color: "red" };
                    }}
                />
            </div>
        </>
    );
}

export default Notifications;
