import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect, useMemo, useRef } from "react";
import formationHelper from "../../helpers/formationHelper";
import notificationsHelper from "../../helpers/notificationsHelper";
import { useNotification } from "../../../context/notificationContext";
import Styles from "./Formations.module.css";
import PopupWrapper from "../../components/popups/PopupWrapper";
import PopupFormSession from "../../components/forms/PopupFormSession/PopupformSession.jsx";
import PopupFormTypeFormation from "../../components/forms/PopupFormTypeFormation/PopupFormTypeFormation.jsx";

export default function Formations() {
    const [formationCreationMode, setFormationCreationMode] = useState(false);

    const { notify } = useNotification();
    const [selectedFormation, setSelectedFormation] = useState(null);
    const popuRef = useRef(null);
    let formations = [];
    const onFormationCreated = () => {
        setFormationCreationMode(false);
        refreshDataGrid();
        
    };
    const colDefs = [
        { field: "Nom", filter: true },
        { field: "Description", filter: false },
        { field: "Actions", filter: false },
    ];

    const refreshDataGrid = () => {
        setReloadTrigger((prev) => prev + 1);
    };
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const getDataSource = useMemo(
        () => ({
            getRows: async (params) => {
                const offset = params.startRow;
                const pageSize = params.endRow - params.startRow;

                const response = await formationHelper.getFormations(
                    offset,
                    pageSize
                );
                formations = response.data.formations;
                const rows = response.data.formations.map((formation) => ({
                    id: formation.id,
                    Nom: formation.name,
                    Description: formation.description,
                }));
                params.successCallback(rows, response.data.total);
            },
        }),
        [reloadTrigger]
    );

    const onModifyFormation = (formation) => {
        const selectedFormation = formations.find((s) => s.id === formation.id);
        setSelectedFormation(selectedFormation);
        popuRef.current.click();
    };
    const onClosePopup = () => {
        setFormationCreationMode(false);
        setSelectedFormation(null);
    };

    return (
        <>
            <div className={Styles.buttonContainer}>
                {formationCreationMode && (
                    <PopupWrapper
                        title={
                            selectedFormation
                                ? "Modifier la formation"
                                : "Créer une formation"
                        }
                        onClose={() => onClosePopup()}
                    >
                        <PopupFormTypeFormation
                            onFormationCreated={onFormationCreated}
                            formation={selectedFormation}
                        />
                    </PopupWrapper>
                )}

                <button
                    className={Styles.addButton}
                    ref={popuRef}
                    onClick={() => setFormationCreationMode(true)}
                >
                    Créer un type de formation
                </button>
            </div>
            <div className={Styles.mainContainer}>
                <DataGrid
                    colDefs={colDefs}
                    data={getDataSource}
                    onActionClick={(formation) => {
                        onModifyFormation(formation);
                    }}
                    renderIconWithCondition={(formation) => "ic:outline-edit"}
                />
            </div>
        </>
    );
}

