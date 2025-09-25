import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context/userContext";
import Widget from "../../components/Widget/Widget";
import styles from "./Home.module.css";
import DataGrid from "../../components/DataGrid/DataGrid";
import AlertWidget from "../../components/Widget/AlertWidget/AlertWidget";
import Tasks from "../../components/Widget/Tasks/Tasks";
import BigCalendar from "../../components/calendar/BigCalendar";
import interventionsHelper from "../../helpers/interventionsHelper";
import {
    getInterventionEndDate,
    getInterventionStartDate,
} from "../../utils/date";
import { isAdmin, isFormateur } from "../../utils/userRole";
import StatsWidget from "../../components/Widget/StatsWidget/StatsWidget";

export default function Home() {
    const { user } = useContext(UserContext);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const getEvents = async () => {
            if (!user || !user.id) return;

            

            try {
                // Get interventions
                const interventionsResponse =
                    await interventionsHelper.getByUserId(user.id);

                const events = interventionsResponse.data.map(
                    (intervention) => ({
                        title: intervention?.ModuleFormation?.name ?? "N/A",
                        start: getInterventionStartDate(
                            intervention.dateIntervention,
                            intervention.shift
                        ),
                        end: getInterventionEndDate(
                            intervention.dateIntervention,
                            intervention.shift,
                            intervention.hours
                        ),
                        allDay: false,
                    })
                );

                setEvents(events);
                // logger.info("events", events);
            } catch (error) {
                console.error(error);
            }
        };
        getEvents().then(() => {
            console.info("events", events);
        });
    }, []);
    return (
        <section className={styles.widgetGrid}>
            {user && isAdmin(user) && (
                <Widget titre="Statistiques" classString={styles.twoColumns + " " + styles.widget}>
                    {" "}
                    <StatsWidget/> 
                </Widget>
            )}

            {user && isFormateur(user) && (
                <Widget
                    titre="calendrier"
                    classString={styles.twoColumns + " " + styles.widget}
                >
                    {" "}
                    <BigCalendar events={events} />
                </Widget>
            )}

             {user && isAdmin(user) && (
            <Widget titre="alertes" classString={styles.twoColumns}>
                {" "}
                <AlertWidget />
            </Widget>
            )}

            {user && isFormateur(user) && (
            <Widget titre="widget" classString={styles.widget}>
                {" "}
                <Tasks />
            </Widget>
            )}      

           
        </section>
    );
}
