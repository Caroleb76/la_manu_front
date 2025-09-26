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
    const [rows, setRows] = useState([]);
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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {

        const response = await formationHelper.getFormations();
        const convertedData = response.data.formations.map(convertRow);
        setRows(convertedData);

    }
    const convertRow = (formation) => ({
        id: formation.id,
        Nom: formation.name,
        Description: formation.description,
    });
    const refreshDataGrid = () => {
        setReloadTrigger((prev) => prev + 1);
    };
    const [reloadTrigger, setReloadTrigger] = useState(0);


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
                    className="btn "
                    ref={popuRef}
                    onClick={() => setFormationCreationMode(true)}
                >
                    Créer un type de formation
                </button>
            </div>
            <div className={Styles.mainContainer}>
                <DataGrid
                    colDefs={colDefs}
                    rowData={rows}
                    onActionClick={(formation) => {
                        onModifyFormation(formation);
                    }}
                    renderIconWithCondition={(formation) => "ic:outline-edit"}
                />
            </div>
        </>
    );
}

