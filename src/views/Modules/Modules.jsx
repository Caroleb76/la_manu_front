import DataGrid from "../../components/DataGrid/DataGrid.jsx";
import { useState, useEffect, useRef } from "react";
import styles from "./Modules.module.css";
import PopupWrapper from "../../components/popups/PopupWrapper.jsx";
import { useNotification } from "../../../context/notificationContext.jsx";
import modulesHelper from "../../helpers/modulesHelper.js";
import PopupformModule from "../../components/forms/PopupFormModule/PopupFormModule.jsx";

export default function Modules() {
    const [moduleCreationMode, setModuleCreationMode] = useState(false);
    const [selectedModule, setSelectedModule] = useState(null);
    const [rows, setRows] = useState([]);
    const popuRef = useRef(null);
    const [modules, setModules] = useState([]);

    const colDefs = [
        { field: "Nom", filter: true },
        { field: "Formation", filter: true },
        { field: "Description", filter: true },
        { field: "Actions", filter: false },
    ];


    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const response = await modulesHelper.getModules();
        const convertedData = response.data.map(convertData);
        setModules(response.data);
        setRows(convertedData);
    }

    const convertData = (module) => ({
        id: module.id,
        Nom: module.name,
        Formation: module.Formation.name,
        Description: module.description,
    });



    const onModuleCreated = () => {
        closePopup();                   // ferme + reset le selectedModule
        fetchData();                    // recharge la grille
    };

    const onModifyModule = (row) => {
        const m = modules.find((s) => s.id === row.id);
        openPopup(m);                   // plus de ref.click()
    };


    const openPopup = (m = null) => {
        setSelectedModule(m);           // null => mode création, objet => mode édition
        setModuleCreationMode(true);
    };

    const closePopup = () => {
        setModuleCreationMode(false);
        setSelectedModule(null);        // IMPORTANT : reset après update/close
    };


    return (
        <>
            <div className={styles.mainContainer}>

                {moduleCreationMode && (

                    <PopupWrapper
                        // key force le remount quand on passe de edit -> create et inversement
                        key={selectedModule ? `edit-${selectedModule.id}` : "create"}
                        title={selectedModule ? "Modifier le module" : "Créer un module"}
                        onClose={closePopup}
                    >
                        <PopupformModule
                            onModuleCreated={onModuleCreated}
                            module={selectedModule}
                            modules={modules}
                        />
                    </PopupWrapper>
                )}
                <div className={styles.btnContainer}>
                    <button
                        className="btn btn-primary"
                        ref={popuRef}
                        onClick={() => openPopup()}
                    >
                        Créer
                    </button>

                </div>

                <DataGrid

                    onActionClick={onModifyModule}
                    colDefs={colDefs}

                    rowData={rows}

                    renderIconWithCondition={(module) => "ic:outline-edit"}
                />
            </div>
        </>
    );
}


