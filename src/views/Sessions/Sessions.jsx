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
    let sessions = [];
    const onSessionCreated = () => {
        setSessionCreationMode(false);
        refreshDataGrid();
        notify("La session a bien été ajoutée", "success");
    };
    const colDefs = [
        { field: "Formation", filter: true },
        { field: "Numero", filter: true },
        { field: "Début", filter: true },
        { field: "Fin", filter: false },
        { field: "Lieu", filter: false },
        { field: "Actions", filter: false },
    ];

    const refreshDataGrid = () => {
        setReloadTrigger(prev => prev + 1);
    }
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const getDataSource = useMemo(() => ({

        getRows: async (params) => {

            const offset = params.startRow;
            const pageSize = params.endRow - params.startRow;

            const response = await formationsHelper.getSessions(
                offset,
                pageSize
            );
            sessions = response.data.sessionFormations;
            const rows = response.data.sessionFormations.map((session) => ({
                id: session.id,
                Formation: session.Formation.name,
                Début: new Date(session.startDate).toLocaleDateString(),
                Fin: new Date(session.endDate).toLocaleDateString(),
                Lieu: session.Address.city,
                Numero: session.serialNumber,
            }));
            // console.log(rows, response.data.total);

            params.successCallback(rows, response.data.total);

        },
    }), [reloadTrigger]);

    const onModifySession = (session) => {
        const selectedSession = sessions.find((s) => s.id === session.id);
        console.log("selected session", selectedSession);
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
                data={getDataSource}
                onActionClick={(session) => { onModifySession(session) }}
                renderIconWithCondition={(session) => "ic:outline-edit"}
                />
            </div>
        </>
    );
}

