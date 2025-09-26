import DataGrid from "../../components/DataGrid/DataGrid.jsx";
import { useState, useEffect, useMemo } from "react";
import notificationsHelper from "../../helpers/notificationsHelper.js";
import styles from "./Modules.module.css";
import PopupWrapper from "../../components/popups/PopupWrapper.jsx";
import { useNotification } from "../../../context/notificationContext.jsx";
import PopupformNotification from "../../components/forms/PopupFormNotification/PopupformNotification.jsx";
import { PRIORITIES } from "../../utils/constants.js";
import modulesHelper from "../../helpers/modulesHelper.js";
import PopupformModule from "../../components/forms/PopupFormModule/PopupFormModule.jsx";

function Modules() {
    const [notificationCreationMode, setNotificationCreationMode] =
        useState(false);
    const { notify } = useNotification();
    const dataGridRef = null;
    const [rows, setRows] = useState([]);
    const colDefs = [
        { field: "Nom", filter: true },
        { field: "Formation", filter: true },
        { field: "Description", filter: true },
        // { field: "Actions", filter: false },
    ];

    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    useEffect(() => {
        fetchData();
    }, [])
    const convertData = (module) => ({
        id: module.id,
        Nom: module.name,
        Formation: module.Formation.name,
        Description: module.description,
    });

    const fetchData = async () => {
        const response = await modulesHelper.getModules();
        const convertedData = response?.data?.map(convertData);
        setRows(convertedData);
    }

    // const onSearchTextChange = (e) => {
    //     setSearchText(e.target.value);
    //     if (e.target.value.length < 3 && e.target.value.length > 0) return;
    //     setReloadTrigger((prev) => prev + 1);
    // };

    const onEditModule = async (module) => {
        //TODO
    };

    const onNotificationCreated = () => {
        setNotificationCreationMode(false);
        setReloadTrigger((prev) => prev + 1);
        notify("Le module a bien été créé", "success");
    };

    return (
        <>
            <div className={styles.mainContainer}>
                {notificationCreationMode && (
                    <>
                        <PopupWrapper
                            title="Créer un module de formation"
                            onClose={() => setNotificationCreationMode(false)}
                        >
                            <PopupformModule
                                onNotificationCreated={onNotificationCreated}
                            />
                        </PopupWrapper>
                    </>
                )}
                <div className={styles.btnContainer}>
                    <button
                        className="btn btn-primary"
                        onClick={() => setNotificationCreationMode(true)}
                    >
                        Créer
                    </button>
                </div>
                {/* <input
                    type="text"
                    placeholder="Rechercher"
                    value={searchText}
                    onChange={(e) => onSearchTextChange(e)}
                /> */}
                <DataGrid
                    pageSize={pageSize}
                    onActionClick={onEditModule}
                    colDefs={colDefs}
                    rowData={rows}
                    // renderIconWithCondition={(module) =>
                    //     "ic:outline-edit"
                    // }
                    iconStyle={(module) => {
                        return { color: "red" };
                    }}
                />
            </div>
        </>
    );
}

export default Modules;
