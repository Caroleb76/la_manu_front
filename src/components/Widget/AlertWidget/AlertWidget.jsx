import React, { useEffect, useState } from 'react'
import AlertCard from '../../cards/AlertCard/AlertCard'
import styles from './AlertWidget.module.css'
import notificationsHelper from '../../../helpers/notificationsHelper'

export default function AlertWidget() {
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await notificationsHelper.getNotifications()
            // console.log(response)
            if (response.success) {
                setNotifications(response.data.notifications)

            }
        }
        fetchNotifications()

    }, [])
    const testAlert = {
        title: "TestTitre",
        startDate: "15/06/29",
        priority: 1,
        content: "essai de contenu"
    }
    return (
        <div className={styles.alertWrapper}>
            {notifications && notifications.map((notification) => (
                <span key={notification.id}> 
                    <AlertCard alert={notification} />
                </span>
            ))}




        </div>
    )
}
