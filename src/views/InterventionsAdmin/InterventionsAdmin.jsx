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
import { isAdmin } from "../../utils/userRole.js";
import ExtraCosts from "../../components/extraCosts/ExtraCosts.jsx";
import { set } from "zod/v4-mini";

function InterventionsAdmin() {
    const { user } = useContext(UserContext);
    const [showDetails, setShowDetails] = useState(false);
    const [interventions, setInterventions] = useState([]);
    const [selectedIntervention, setSelectedIntervention] = useState(null);

    const [notificationCreationMode, setNotificationCreationMode] =
        useState(false);
    const { notify } = useNotification();


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
        {
            field: "Actions",
            filter: false,
            actions: [
                {
                    visible: isAdmin(user),
                    label: "Voir",
                    onClick: (row) => {
                        setShowDetails(true);
                        setSelectedInterventionFromRow(row);
                        console.log(selectedIntervention);
                    },

                    icon: {
                        icon: "material-symbols:visibility",
                    },
                },
                {
                    visible: isAdmin(user),
                    label: "Payer",
                    onClick: (data) => onValidatePayment(data),

                    icon: {
                        icon: "ic:outline-price-check",
                    },
                },
            ],
        },
    ];

    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    const [rows,setRows] = useState([]);



  useEffect(() => {
    (async () => {
      try {
        const newRows =
          user?.role?.name === "ADMIN" ? await fetchAllForAdmin() : await fetchForUser();
        setRows(newRows);
      } finally {
      }
    })();
  }, [reloadTrigger, user?.id, user?.role?.name]);

  const fetchForUser = async () => {
    const resp = await interventionsHelper.getByUserId(user.id);
    const list = Array.isArray(resp?.data) ? resp.data : [];
    return list.map(mapToRow);
  };
   const fetchAllForAdmin = async () => {

      const resp = await interventionsHelper.getInterventions();
      const batch = Array.isArray(resp?.data) ? resp.data : [];

    return batch.map(mapToRow);
  };

  const mapToRow = (interventions) => ({
    Id: interventions.id,
    Nom: interventions.Contract?.User?.lastName,
    Prenom: interventions.Contract?.User?.firstName,
    Module: interventions.ModuleFormation?.name,
    Date: convertDateToFranceTimeZone(interventions.dateIntervention),
    Horaire: interventions.shift,
    Duree: `${interventions.hours} h`,
    Categorie: interventions.InterventionCategory?.name,
    Tarif: `${interventions.InterventionCategory?.rate} €`,
    "A payer": interventions.validatedByFormateur ? "✅" : "❌",
    Payée: interventions.validatedByAdmin ? "✅" : "❌",
  });

 




    const onValidatePayment = async (intervention) => {
        if (intervention["A payer"] == "❌") {
            notify(
                "L'intervention n'a pas encore été validée par le formateur",
                "error"
            );
            return;
        }
        const response = await interventionsHelper.validatePayment(
            intervention.Id
        );
        if (response && response.success) {
            setReloadTrigger((prev) => prev + 1);
            notify("Le changement a bien été pris en compte", "success");
        } else {
            notify("Une erreur est survenue", "error");
        }
    };

    const onNotificationCreated = () => {
        setNotificationCreationMode(false);
        setReloadTrigger((prev) => prev + 1);
        notify("L'intervention a bien été ajoutée", "success");
    };

    const setSelectedInterventionFromRow = async (row) => {
        const response = await  interventionsHelper.getById(row.Id);
        setSelectedIntervention(response.data);
    };
// const onSearchTextChange = (e) => {
//     setSearchText(e.target.value);
//     if (e.target.value.length < 3 && e.target.value.length > 0) return;
//     setReloadTrigger((prev) => prev + 1);
// };

    return (
        <>
            <div className={styles.mainContainer}>
                {showDetails && (
                    <PopupWrapper
                        title="Liste des frais de déplacement"
                        onClose={() => setShowDetails(false)}
                    >
                        
                        <ExtraCosts iv={selectedIntervention} />
                    </PopupWrapper>
                )}

                {/* <input
                    type="text"
                    placeholder="Rechercher"
                    value={searchText}
                    onChange={(e) => onSearchTextChange(e)}
                />  */}
                {
                    rows.length > 0 && 
                <DataGrid
                    pageSize={pageSize}
                    colDefs={colDefs}
                    rowData={rows}
                    renderIconWithCondition={(intervention) =>
                        intervention?.Payée === "✅"
                            ? "ic:outline-cancel"
                            :  "ic:outline-price-check"
                    }
                   
                />
                }
            </div>
        </>
    );
}

export default InterventionsAdmin;
