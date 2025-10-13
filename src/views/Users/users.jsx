import { useEffect, useMemo, useRef, useState } from "react";
import DataGrid from "../../components/DataGrid/DataGrid";
import usersHelper from "../../helpers/usersHelper";
import Styles from "./User.module.css";
import { useNotification } from "../../../context/notificationContext";
import PopupFormUser from "../../components/forms/PopupFormUser/PopupformUser.jsx";
import PopupWrapper from "../../components/popups/PopupWrapper";
import Profile from "../Profile/Profile.jsx";
import { Icon } from "@iconify/react/dist/iconify.js";

function Users() {
    const [userCreationMode, setUserCreationMode] = useState(false);
    const dataGridRef = null;
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [rows, setRows] = useState([]);
    const [searchText, setSearchText] = useState("");
    const { notify } = useNotification();
    const [pageSize, setPageSize] = useState(10);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const colDefs = [
        { field: "Email", filter: true },
        { field: "Nom", filter: true },
        { field: "Prenom", filter: true },
        { field: "Role", filter: true },
        {
            field: "Actions",
            filter: false,
            actions: [
                {
                    label: "Bloquer",
                    onClick: (data) => blockUser(data),

                    icon: {
                        icon: "material-symbols:lock-outline",
                        condition: (user) => {
                            return user?.blocked
                                ? "material-symbols:lock-open-outline"
                                : "material-symbols:lock-outline";
                        },
                    },
                },
                {
                    label: "Editer",
                    onClick: (data) => editUser(data),

                    icon: {
                        icon: "material-symbols:edit-outline",
                    },
                },
            ],
        },
    ];

    useEffect(() => {
        (async () => {
            const users = await fetchUsers();
            setRows(users);
        })();
    }, []);

    function refreshDataGrid() {
        setReloadTrigger((prev) => prev + 1);
        if (dataGridRef?.current) dataGridRef.current.refreshData();
    }
    const onUserCreated = () => {
        setUserCreationMode(false);
        refreshDataGrid();
        notify("L'utilisateur a bien été ajouté", "success");
    };

    const onSearchTextChange = (e) => {
        setSearchText(e.target.value);
        if (e.target.value.length < 3 && e.target.value.length > 0) return;
        refreshDataGrid();
    };

    const mapToRow = (user) => ({
        id: user.id,
        Nom: user.lastName,
        Prenom: user.firstName,
        Email: user.email,
        Role: user.role.name,
        blocked: user.blocked,
    });

    const fetchUsers = async () => {
        // console.log("Requête : offset=", offset, "limit=", pageSize, "page=", pageNumberRef.current);
        // pageNumberRef.current=Math.floor(offset/pageSize);
        const response = await usersHelper.getUsers();
        const rows = response.data.users.map(mapToRow);
        return rows;
    };

    const blockUser = async (data) => {
        const updatedUser = { ...data, blocked: !data.blocked };
        await usersHelper.blockUser(updatedUser.id, updatedUser);
        refreshDataGrid();
        notify("L'utilisateur a bien été modifié", "success");
    };
    const editUser = async (data) => {
        console.log("edit user", data);
        setSelectedUserId(data.id);
        setUserCreationMode(false);
    };

    return (
        <>
            <div className={Styles.mainContainer}>
                {selectedUserId ? (
                    <>
                        <div className={Styles.backButtonContainer}>
                            <Icon
                                className={Styles.backButton}
                                icon="material-symbols:arrow-back-ios-rounded"
                                width="1.8rem"
                                onClick={() => setSelectedUserId(null)}
                            />
                            <p>Liste des utilisateurs</p>
                        </div>
                        <Profile userId={selectedUserId} />
                    </>
                ) : (
                    <>
                        {/* case of creating a new user */}
                        {userCreationMode && (
                            <PopupWrapper
                                title="Créer un utilisateur"
                                onClose={() => setUserCreationMode(false)}
                            >
                                <PopupFormUser onUserCreated={onUserCreated} />
                            </PopupWrapper>
                        )}
                        {/* case of showing the data grid */}
                        <div className={Styles.btnContainer}>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => setUserCreationMode(true)}
                            >
                                Créer
                            </button>
                        </div>
                        {/* <input type="text" placeholder="Rechercher" value={searchText} onChange={(e) => onSearchTextChange(e)} /> */}
                        {rows.length > 0 && (
                            <DataGrid
                                pageSize={pageSize}
                                colDefs={colDefs}
                                rowData={rows}
                                onActionClick={blockUser}
                                renderIconWithCondition={(user) =>
                                    user?.blocked
                                        ? "material-symbols:lock-outline"
                                        : "material-symbols:lock-open-right-outline-sharp"
                                }
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default Users;
