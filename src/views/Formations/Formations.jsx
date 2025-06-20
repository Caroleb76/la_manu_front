import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect, useMemo } from "react";
import formationsHelper from "../../helpers/sessionFormationsHelper";
import notificationsHelper from "../../helpers/notificationsHelper";
import { useNotification } from "../../../context/notificationContext";
import Styles from "./Formations.module.css";
import PopupWrapper from "../../components/popups/PopupWrapper";
import PopupFormSession from "../../components/forms/PopupFormSession/PopupformSession.jsx"

function Formations() {
    const [sessionCreationMode, setSessionCreationMode] =
        useState(false);
    const { notify } = useNotification();
    const dataGridRef = null;

    const onSessionCreated = () => {
        setSessionCreationMode(false);
        refreshDataGrid();
        notify("La notification a bien été ajoutée", "success");
    };
    const colDefs = [
        { field: "Formation", filter: true },
        { field: "Numero", filter: true },
        { field: "Début", filter: true },
        { field: "Fin", filter: false },
        { field: "Lieu", filter: false },
    ];
    const [reloadTrigger, setReloadTrigger] = useState(0);
    function refreshDataGrid() {
        setReloadTrigger((prev) => prev + 1);
        if (dataGridRef?.current) dataGridRef.current.refreshData();
    }
    const getDataSource = useMemo(
        () => ({
            getRows: async (params) => {
                const offset = params.startRow;
                const pageSize = params.endRow - params.startRow;

                const response = await formationsHelper.getSessions(
                    offset,
                    pageSize
                );
                /**
             * serialNumber  String
  startDate     DateTime?
  endDate       DateTime?

  formationId   String?
  addressId     String?

  Formation     Formation? @relation(fields: [formationId], references: [id])
  Address       Address?   @relation(fields: [addressId], references: [id])
             */
                const rows = response.data.sessionFormations.map((session) => ({
                    id: session.id,
                    Formation: session.Formation.name,
                    Numero: session.serialNumber,
                    Début: new Date(session.startDate).toLocaleDateString(),
                    Fin: new Date(session.endDate).toLocaleDateString(),
                    Lieu: session.Address.city,
                }));
                // console.log(rows, response.data.total);

                params.successCallback(rows, response.data.total);
            },
        }),
        [reloadTrigger]
    );

    return (
        <>
            <div className={Styles.buttonContainer}>
                {sessionCreationMode && (
                    <PopupWrapper title="Créer une session" onClose={() => setSessionCreationMode(false)}>
                        <PopupFormSession  onSessionCreated={onSessionCreated} />
                    </PopupWrapper>
                )}
                <button className={Styles.addButton} onClick={() => {}}>
                    Créer un type de formation
                </button>
                <button
                    className={Styles.addButton}
                    onClick={() => setSessionCreationMode(true)}
                >
                    Créer une session
                </button>
            </div>
            <div className={Styles.mainContainer}>
                <DataGrid colDefs={colDefs} data={getDataSource} />
            </div>
        </>
    );
}

export default Formations;
