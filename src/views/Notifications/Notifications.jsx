import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect } from "react";
import notificationsHelper from "../../helpers/notificationsHelper";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const colDefs = [
        { field: "Titre", filter: true },
        { field: "Priorité", filter: true },
        { field: "Contenu", filter: true },
        { field: "Date de début", filter: false },
        { field: "Date de fin", filter: false },
    ];

    useEffect(() => {
        async function getNotifications() {
            const response = await notificationsHelper.getNotifications();
            const responseNotifications = response.data;
            console.log("notifs", responseNotifications);
            // console.log("rolename", responseNotifications[0]);

            setNotifications(
                responseNotifications.map((notification) => ({
                    Titre: notification.title,
                    Priorité: notification.priority,
                    Contenu: notification.content,
                    "Date de début": new Date(notification.startDate).toLocaleDateString(),
                    "Date de fin": new Date(notification.startDate).toLocaleDateString(),
                }))
            );
        }
        getNotifications();
    }, []);
    return (
        <>
            <title>Notifications</title>
            <DataGrid colDefs={colDefs} data={notifications} />
        </>
    );
}

export default Notifications;
