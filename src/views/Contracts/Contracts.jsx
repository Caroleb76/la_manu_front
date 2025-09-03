import DataGrid from "../../components/DataGrid/DataGrid";
import { useState, useEffect, useMemo, useContext } from "react";
import contractsHelper from "../../helpers/contractsHelper";
import styles from "./Contracts.module.css";
import { Link } from "react-router";
import { UserContext } from "../../../context/userContext";
import { convertDateToFranceTimeZone } from "../../utils/date";
import { useNavigate } from "react-router";

export default function Contracts() {
    let navigate = useNavigate();
    const { user } = useContext(UserContext);

    const colDefs = [
        { field: "Nom Prénom", filter: true },
        { field: "Formation", filter: true },
        { field: "Date de Début", filter: false },
        { field: "Date de Fin", filter: false },
        { field: "Heures", filter: false },
        { field: "Interventions", filter: false },
        { field: "Signé", filter: false },
        { field: "Déclaré", filter: false },
        { field: "ValidéAdmin", filter: false },
        { field: "ValidéFormateur", filter: false },

        {
            field: "Actions",
            filter: false,
            actions: [
                {
                    visible: user.role.name === "ADMIN",
                    label: "Editer",
                    onClick: (data) => editContract(data),

                    icon: {
                        icon: "material-symbols:edit-outline",
                    },
                },
                {
                    visible: user.role.name === "FORMATEUR",
                    label: "Signer",
                    onClick: (data) => signContract(data),

                    icon: {
                        icon: "material-symbols:stylus-note",
                    },
                },
            ],
        },
    ];

    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [selectedContactId, setSelectedContractId] = useState(null);

    const getDataSource = useMemo(
        () => ({
            getRows: async (params) => {
                const offset = params.startRow;
                const pageSize = params.endRow - params.startRow;
                let filter = null;
                if (!user.isAdmin) {
                    filter = `{"userId":"${user.id}"}`;
                }
                const response = await contractsHelper.getContracts(
                    offset,
                    pageSize,
                    searchText,
                    filter
                );

                const rows = response.data.contracts.map((contract) => {
                    const hasUnvalidatedInterventions =
                        contract?.Interventions?.some(
                            (intervention) =>
                                !intervention.validatedByAdmin ||
                                !intervention.validatedByFormateur
                        );
                    return {
                        id: contract.id,
                        "Nom Prénom":
                            contract.User.firstName +
                            " " +
                            contract.User.lastName,
                        Formation: contract.SessionFormation.Formation.name,
                        "Date de Début": convertDateToFranceTimeZone(
                            contract.startDate
                        ),
                        "Date de Fin": convertDateToFranceTimeZone(
                            contract.endDate
                        ),
                        Heures: contract.totalHours, //somme des temps des interventions
                        Interventions: contract.interventions.length,
                        Signé: contract.signed ? "✅" : "❌",
                        Déclaré: contract.declared ? "✅" : "❌",
                        ValidéFormateur: contract.validatedByFormateur
                            ? "✅"
                            : "❌",
                        ValidéAdmin: contract.validatedByAdmin ? "✅" : "❌",
                    };
                });
                if (searchText.length > 0) {
                    setPageSize(rows.length);
                } else {
                    setPageSize(pageSize);
                }
                // console.log(rows, response.data.total);

                params.successCallback(rows, response.data.total);
            },
        }),
        [reloadTrigger]
    );

    useEffect(() => {
       console.log(user);
    }, [user]);

    const onSearchTextChange = (e) => {
        setSearchText(e.target.value);
        setReloadTrigger(reloadTrigger + 1);
    };

    const editContract = async (data) => {
        setSelectedContractId(data.id);
        navigate(`/dashboard/contracts/edit/${data.id}`);
    };

    const signContract = async (data) => {
        setSelectedContractId(data.id);
        navigate(`/dashboard/contracts/sign/${data.id}`);
    };

    return (
        <>
            <div className={styles.mainContainer}>
                {user.isAdmin && (
                    <>
                        <Link
                            to="/dashboard/contracts/create"
                            className="btn btn-add"
                        >
                            Créer un contrat
                        </Link>
                        <input
                            type="text"
                            placeholder="Rechercher"
                            value={searchText}
                            onChange={(e) => onSearchTextChange(e)}
                        />
                    </>
                )}
                <DataGrid
                    pageSize={pageSize}
                    colDefs={colDefs}
                    data={getDataSource}
                />
            </div>
        </>
    );
}
