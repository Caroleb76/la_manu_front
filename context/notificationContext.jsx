import { createContext, useContext, useState } from "react";
const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificaitonProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const notify = (message, type = "success") => {
        const id = Date.now();
        // I add the notification
        setNotifications((prevNotificaitons) => [...prevNotificaitons, { id: id, message: message, type: type }]);
        // I delete the notification from the list after delaly of 3 seconds
        setTimeout(() => {
            setNotifications((prevNotificaitons) => prevNotificaitons.filter((notification) => notification.id !== id));
        }, 3000);
    }

    return (
        <NotificationContext.Provider value={{ notify }}>

            {children}
            <div className="notification-container">
                {notifications.map((n) => (
                    <div key={n.id} className={`notification ${n.type}`}>
                        {n.message}
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    )


}