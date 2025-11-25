import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect, useMemo, useRef } from "react";
import formationHelper from "../../helpers/formationHelper";
import { useNotification } from "../../../context/notificationContext";
import Styles from "./Formations.module.css";
import PopupWrapper from "../../components/popups/PopupWrapper";
import PopupFormTypeFormation from "../../components/forms/PopupFormTypeFormation/PopupFormTypeFormation.jsx";

export default function Formations() {
    const [formationCreationMode, setFormationCreationMode] = useState(false);
    const { notify } = useNotification();
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [rows, setRows] = useState([]);
    const popuRef = useRef(null);
    let [formations, setFormations]  =useState([]);

    const onFormationCreated = () => {
        setFormationCreationMode(false);
         fetchData();

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
        setFormations(response.data.formations)
        setRows(convertedData);

    }
    const convertRow = (formation) => ({
        id: formation.id,
        Nom: formation.name,
        Description: formation.description,
    });

    const onModifyFormation = (formation) => {
    //  console.log(formations)
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
                            formations={formations}
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

