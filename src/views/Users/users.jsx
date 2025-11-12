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
    const [users, setUsers] = useState([]);

    const [rows, setRows] = useState([]);

    const { notify } = useNotification();
    const [pageSize, setPageSize] = useState(10);
    const [selectedUser, setSelectedUser] = useState(null);
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
       fetchData();
    }, []);



    const convertData = (user) => ({
    
        id: user.id,
        Nom: user.lastName,
        Prenom: user.firstName,
        Email: user.email,
        Role: user.role.name,
        blocked: user.blocked,
    });

    const fetchData = async () => {
        
        const response = await usersHelper.getUsers();
         let convertedData = response.data.users.map(convertData);
        setUsers(response.data.users);
        convertedData.sort((a, b) =>{
            if(a.Nom != b.Nom){
                return a.Nom.localeCompare(b.Nom);
            }else if ( a.Prenom != b.Prenom){
                return a.Prenom.localeCompare(b.Prenom);
            }
            return a.Email.localeCompare(b.Email);

    });
        setRows(convertedData);
   
    };

    const blockUser = async (data) => {
        const updatedUser = { ...data, blocked: !data.blocked };
        const response = await usersHelper.blockUser(updatedUser.id, updatedUser);
        console.log(response)
        fetchData();
        notify("L'utilisateur a bien été bloqué", "success");

    };
    const editUser = async (data) => {
        console.log("edit user", data);
        setSelectedUser(data.id);
        setUserCreationMode(false);
    };
    const onUserCreated = () => {
        closePopup();                   // ferme + reset le selectedModule
        fetchData();                    // recharge la grille
    };

    const onModifyUser = (row) => {
        const m = users.find((s) => s.id === row.id);
        openPopup(m);                   // plus de ref.click()
    };


    const openPopup = (m = null) => {
        setSelectedUser(m);           // null => mode création, objet => mode édition
        setUserCreationMode(true);
    };

    const closePopup = () => {
        setUserCreationMode(false);
        setSelectedUser(null);        // IMPORTANT : reset après update/close
    };



    return (
        <>
            <div className={Styles.mainContainer}>
                {selectedUser ? (
                    <>
                        <div className={Styles.backButtonContainer}>
                            <Icon
                                className={Styles.backButton}
                                icon="material-symbols:arrow-back-ios-rounded"
                                width="1.8rem"
                                onClick={() => setSelectedUser(null)}
                            />
                            <p>Liste des utilisateurs</p>
                        </div>
                        <Profile userId={selectedUser} />
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
                                onClick={() => openPopup()}
                            >
                                Créer
                            </button>
                        </div>

                        {rows?.length > 0 && (
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
