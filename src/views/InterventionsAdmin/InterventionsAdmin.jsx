import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect, useMemo } from "react";
import interventionsHelper from "../../helpers/interventionsHelper.js";
import styles from "./Interventions.module.css";
import PopupWrapper from "../../components/popups/PopupWrapper.jsx";
import { useNotification } from "../../../context/notificationContext";
import PopupformNotification from "../../components/forms/PopupFormNotification/PopupformNotification.jsx";
import { PRIORITIES } from "../../utils/constants.js";
import { convertDateToFranceTimeZone } from "../../utils/date.js";
import { useContext } from "react";
import { UserContext } from "../../../context/userContext";

function InterventionsAdmin() {
    const { user } = useContext(UserContext);

    const [notificationCreationMode, setNotificationCreationMode] =
        useState(false);
    const { notify } = useNotification();
    const dataGridRef = null;

    const colDefs = [
        { field: "Nom", filter: true },
        { field: "Prenom", filter: true },
        { field: "Module", filter: true },
        { field: "Date", filter: true },
        { field: "Horaire", filter: false },
        { field: "Duree", filter: false },
        { field: "Categorie", filter: false },
        { field: "Tarif", filter: false },
        { field: "A payer", filter: false },
        { field: "Payée", filter: false },
        { field: "Actions", filter: false },
    ];

    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const getDataSource = useMemo(
        () => ({
            getRows: async (params) => {
                const offset = params.startRow;
                const pageSize = params.endRow - params.startRow;

                let response;

                if (user.role.name === "ADMIN") {
                    response = await interventionsHelper.getInterventions(
                        offset,
                        pageSize,
                        searchText
                    );
                } else {
                    response = await interventionsHelper.getByUserId(user.id);
                }

                const rows = response.data.map((interventions) => ({
                    Id: interventions.id,
                    Nom: interventions.Contract.User.lastName,
                    Prenom: interventions.Contract.User.firstName,
                    Module: interventions.ModuleFormation?.name,
                    Date: convertDateToFranceTimeZone(
                        interventions.dateIntervention
                    ),
                    Horaire: interventions.shift,
                    Duree: `${interventions.hours} h`,
                    Categorie: interventions.InterventionCategory?.name,
                    Tarif: `${interventions.InterventionCategory?.rate} €`,
                    "A payer": interventions.validatedByFormateur ? "✅" : "❌",
                    Payée: interventions.validatedByAdmin ? "✅" : "❌",
                }));
                if (searchText.length > 0) {
                    setPageSize(rows.length);
                } else {
                    setPageSize(pageSize);

                }
                // console.log(rows, response.data.total);
                params.successCallback(rows, rows.length);
            },
        }),
        [reloadTrigger]
    );

    const onSearchTextChange = (e) => {
        setSearchText(e.target.value);
        if (e.target.value.length < 3 && e.target.value.length > 0) return;
        setReloadTrigger((prev) => prev + 1);
    };

    const onValidatePayment = async (intervention) => {
        console.log(intervention);
        const response = await interventionsHelper.validatePayment(
            intervention.Id
        );
        if (response && response.success) {
            setReloadTrigger((prev) => prev + 1);
            notify("L'intervention a bien été payée", "success");
        } else {
            notify("Une erreur est survenue", "error");
        }
    };

    const onNotificationCreated = () => {
        setNotificationCreationMode(false);
        setReloadTrigger((prev) => prev + 1);
        notify("La notification a bien été ajoutée", "success");
    };

    return (
        <>
            <div className={styles.mainContainer}>
                {notificationCreationMode && (
                    <>
                        <PopupWrapper
                            title="Créer une notification"
                            onClose={() => setNotificationCreationMode(false)}
                        >
                            <PopupformNotification
                                onNotificationCreated={onNotificationCreated}
                            />
                        </PopupWrapper>
                    </>
                )}
                <button
                    className={styles.addButton}
                    onClick={() => setNotificationCreationMode(true)}
                >
                    Créer
                </button>
                <input
                    type="text"
                    placeholder="Rechercher"
                    value={searchText}
                    onChange={(e) => onSearchTextChange(e)}
                />
                <DataGrid
                    pageSize={pageSize}
                    onActionClick={(intervention) => {
                        onValidatePayment(intervention);
                    }}
                    colDefs={colDefs}
                    data={getDataSource}
                    renderIconWithCondition={(intervention) =>
                        intervention?.Payée === "✅"
                            ? "ic:outline-cancel"
                            :  "ic:outline-price-check"
                    }
                   
                />
            </div>
        </>
    );
}

export default InterventionsAdmin;
