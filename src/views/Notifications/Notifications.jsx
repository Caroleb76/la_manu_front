import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect, useMemo } from "react";
import notificationsHelper from "../../helpers/notificationsHelper";
import styles from "./Notifications.module.css";

function Notifications() {
    const colDefs = [
        { field: "Titre", filter: true },
        { field: "Priorité", filter: true },
        { field: "Contenu", filter: true },
        { field: "Date de début", filter: false },
        { field: "Date de fin", filter: false },
        { field: "Actions", filter: false },
    ];
      const [reloadTrigger, setReloadTrigger] = useState(0);
    const getDataSource = useMemo(() => ({
        getRows: async (params) => {

            const offset = params.startRow;
            const pageSize = params.endRow - params.startRow;

            const response = await notificationsHelper.getNotifications(offset, pageSize);
            
            const rows = response.data.notifications.map((notification) => ({
                id : notification.id,
                Titre: notification.title,
                Priorité: notification.priority,
                Contenu: notification.content,
                isActive   :  new Date(notification.endDate) > new Date()   ,
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

            <DataGrid colDefs={colDefs} data={getDataSource} 
            renderIconWithCondition={(row) => row?.isActive ?    "material-symbols:check-circle"
    : "material-symbols:cancel" }
             iconStyle={(row) => row?.isActive ? { color: "green" } : { color: "red" }}  />
            </div>

        </>
    );
}

export default Notifications;
