import { useMemo, useRef, useState } from "react";
import DataGrid from "../../components/DataGrid/DataGrid";
import usersHelper from "../../helpers/usersHelper";
import Styles from "./User.module.css";
import PopupCreateUser from "../PopupCreateUser/PopupCreateUser";
import { useNotification } from "../../../context/notificationContext";

function Users() {
  const [userCreationMode, setUserCreationMode] = useState(false);
  const dataGridRef = null;
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [searchText, setSearchText] = useState("");
  const {notify}= useNotification();
  const colDefs = [
    { field: "Email", filter: true },
    { field: "Nom", filter: true },
    { field: "Prenom", filter: true },
    { field: "Role", filter: true },
    { field: "Actions", filter: false },
  ];

  function refreshDataGrid() {
    setReloadTrigger(prev => prev + 1);
    if (dataGridRef?.current) dataGridRef.current.refreshData();
  }
  const onUserCreated = () => {
    setUserCreationMode(false);
    refreshDataGrid();
    notify("L'utilisateur a bien été ajouté", "success");
  }

  const onSearchTextChange = (e) => {
    setSearchText(e.target.value);
    if(e.target.value.length < 3 && e.target.value.length > 0) return;
    refreshDataGrid();
  }
  const getDataSource = useMemo(() => ({
    getRows: async (params) => {

      const offset = params.startRow;
      const pageSize = params.endRow - params.startRow;
      
      // console.log("Requête : offset=", offset, "limit=", pageSize, "page=", pageNumberRef.current);
      // pageNumberRef.current=Math.floor(offset/pageSize);
      const response = await usersHelper.getUsers( offset, pageSize, searchText);
      const rows = response.data.users.map((user) => ({
        id: user.id,
        Nom: user.lastName,
        Prenom: user.firstName,
        Email: user.email,
        Role: user.role.name,
        blocked: user.blocked,
      }));
      
      params.successCallback(rows, response.data.total);

    },
  }), [reloadTrigger]);

  const blockUser = async (data) => {
    const updatedUser = { ...data, blocked: !data.blocked };
    await usersHelper.blockUser(updatedUser.id, updatedUser);
    refreshDataGrid();
    notify("L'utilisateur a bien été modifié", "success");
  };

  return (
    <div className={Styles.mainContainer}>
      {userCreationMode && <PopupCreateUser onClose={() => setUserCreationMode(false)} onUserCreated={onUserCreated} />}
      <button className={Styles.addButton} onClick={() => setUserCreationMode(true)}>Créer</button>
      <input type="text" placeholder="Rechercher" value={searchText} onChange={(e) =>  onSearchTextChange(e)} />
      <DataGrid
        colDefs={colDefs}
        data={getDataSource}
        onActionClick={blockUser}
        renderIconWithCondition={(user) =>
          user?.blocked
            ? "material-symbols:lock-outline"
            : "material-symbols:lock-open-right-outline-sharp"
        }
      />
    </div>
  );
}

export default Users;
