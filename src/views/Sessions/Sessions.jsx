import DataGrid from "../../components/DataGrid/DataGrid.jsx";
import { useState, useEffect, useMemo, useRef } from "react";
import formationsHelper from "../../helpers/sessionFormationsHelper.js";
import notificationsHelper from "../../helpers/notificationsHelper.js";
import { useNotification } from "../../../context/notificationContext.jsx";
import Styles from "./Sessions.module.css";
import PopupWrapper from "../../components/popups/PopupWrapper.jsx";
import PopupFormSession from "../../components/forms/PopupFormSession/PopupformSession.jsx"
import PopupFormTypeFormation from "../../components/forms/PopupFormTypeFormation/PopupFormTypeFormation.jsx";



export default function Sessions() {
    const [sessionCreationMode, setSessionCreationMode] =
        useState(false);
    const [typeFormationCreationMode, setTypeFormationCreationMode] =
        useState(false);
    const { notify } = useNotification();
    const [selectedSession, setSelectedSession] = useState(null);
    const popuRef = useRef(null);
    const [rows,setRows] = useState([]);
    const [sessions,setSessions] = useState([]);
    const onSessionCreated = () => {
        setSessionCreationMode(false);
        fetchData();
        // notify("La session a bien été ajoutée", "success");
    };
    const colDefs = [
        { field: "Formation", filter: true },
        { field: "Numero", filter: true },
        { field: "Début", filter: true },
        { field: "Fin", filter: false },
        { field: "Lieu", filter: false },
        { field: "Actions", filter: false },
    ];



    useEffect(() => {
        fetchData();
    },[])
    const [reloadTrigger, setReloadTrigger] = useState(0);

    const fetchData = async () =>{
        const response = await formationsHelper.getSessions( );
        const convertedData = response.data.sessionFormations.map(convertRow);
        setRows(convertedData);
        setSessions(response.data.sessionFormations);
    }
    const convertRow = (session) => ({
            id: session.id,
            Formation: session.Formation.name,
            Début: new Date(session.startDate).toLocaleDateString(),
            Fin: new Date(session.endDate).toLocaleDateString(),
            Lieu: session.Address.city,
            Numero: session.serialNumber,
        });


    const onModifySession = (session) => {
        const selectedSession = sessions.find((s) => s.id === session.id);
        if(!selectedSession) return;
        // console.log("selected session", selectedSession);
        selectedSession.startDate = new Date(selectedSession.startDate).toISOString().split("T")[0];
        selectedSession.endDate = new Date(selectedSession.endDate).toISOString().split("T")[0];
        setSelectedSession(selectedSession);
        popuRef.current.click();
    }
    const onClosePopup = () => {
        setSessionCreationMode(false)
        setSelectedSession(null);
    }

    return (
        <>
            <div className={Styles.buttonContainer}>
                {typeFormationCreationMode && (
                    <PopupWrapper title="Créer un type de formation" onClose={() => setTypeFormationCreationMode(false)}>
                        <PopupFormTypeFormation onTypeFormationCreated={onTypeFormationCreated} />
                    </PopupWrapper>
                )}
                {sessionCreationMode && (
                    <PopupWrapper title={selectedSession ? "Modifier la session" : "Créer une session"}
                        onClose={() => onClosePopup()}>
                        <PopupFormSession onSessionCreated={onSessionCreated} session={selectedSession} />
                    </PopupWrapper>
                )}

                <button
                    className={Styles.addButton}
                    ref={popuRef}
                    onClick={() => setSessionCreationMode(true)}
                >
                    Créer une session
                </button>
            </div>
            <div className={Styles.mainContainer}>

                <DataGrid
                    colDefs={colDefs}
                    rowData={rows}
                    onActionClick={(session) => { onModifySession(session) }}
                    renderIconWithCondition={(session) => "ic:outline-edit"}
                />
            </div>
        </>
    );
}

